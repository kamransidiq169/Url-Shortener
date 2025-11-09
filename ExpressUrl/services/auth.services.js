import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import { oauthAccountsTable, passwordResetTokenTable, sessionsData, shortLinks, users, verifyEmailTokensTable } from "../drizzle/schema.js";
// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import argon from 'argon2'
import crypto from "crypto";
import { lt } from "drizzle-orm";
// export const getEmail = async ({ email }) => {
//   return await db.select().from(users).where(eq(users.email, email))
// }
export const getEmail = async ({ email }) => {
  return await db
    .select({
      id: usersData.id,
      email: usersData.email,
      password: usersData.password
    })
    .from(usersData)
    .where(eq(usersData.email, email));
};
export const createValues = async ({ name, email, password }) => {
  try {
    const [insertedId] = await db.insert(users).values({ name, email, password });
    return insertedId;
  } catch (err) {
    console.error("Insert failed:", err);
    throw err;
  }
};

export const hashedPassword = async (password) => {
  return await argon.hash(password)
  // return await bcrypt.hash(password,10)
}

export const comparePassword = async (password, hash) => {
  return await argon.verify(hash, password) //! argon mai ulta hai pehlai hash aur uske baad password
  //return await bcrypt.compare(password,hash)
}

// export const generateToken=({id,name,email})=>{
//   return jwt.sign({id,name,email},process.env.SECRET_KEY,{
//     expiresIn:"30d"
//   })
// }



//export const createSession = async (userId, { ip, userAgent }) => {
  // const session = await db.insert(sessionsData).values({ userId, ip, userAgent }).$returningId()
  // return session
  // const result = await db
//   .insert(sessionsData)
//   .values({ userId, ip, userAgent })
//   .$returningId(); // ✅ returns array of inserted rows

// return result[0]; // ✅ first inserted session
// }

export const createSession = async (userId, { ip, userAgent }) => {
  if (!userId) throw new Error("Missing userId for session creation");

  const result = await db
    .insert(sessionsData)
    .values({
      userId,
      valid: true,
      ip,
      userAgent
    })
    .$returningId();

  return result;
};

export const createAccessToken = ({ id, name, email, sessionId }) => {
  return jwt.sign({ id, name, email, sessionId }, process.env.SECRET_KEY, {
    expiresIn: "15m"
  })
}
export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.SECRET_KEY, {
    expiresIn: "1w"
  })
}

export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY)
}

export const findSessionById = async (sessionId) => {
  const session = await db.select().from(sessionsData).where(eq(sessionsData.id, sessionId))
  return session
}

export const findUserById = async (userId) => {
  const user = await db.select().from(users).where(eq(users.id, userId))
  return user
}

export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyJWTToken(refreshToken)
    const [currentSession] = await findSessionById(decodedToken.sessionId)

    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid Session")
    }


    const [user] = await findUserById(currentSession.userId)

    if (!user) {
      throw new Error("Invalid User")
    }

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      sessionId: currentSession.id,
      isEmailVerified: user.isEmailVerified,
    }

    const newAccesstoken = createAccessToken(userInfo)
    const newRefreshtoken = createRefreshToken(currentSession.id)

    return {
      newAccesstoken, newRefreshtoken, user: userInfo
    }

  } catch (error) {
    console.error(error.message)
  }
}

export const clearUserSession = async (sessionId) => {
  return await db.delete(sessionsData).where(eq(sessionsData.id, sessionId))
}


// getAllShortLinks

export const authenticateUser = async ({ req, res, user, name, email }) => {
  // we need to create a sessions
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name || name,
    email: user.email || email,
    isEmailValid: false,
    sessionId: session.id,
  });

  const refreshToken = createRefreshToken(session.id);

const baseConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // or "none" if cross-origin
  maxAge: 10 * 60 * 1000, // 10 minutes
};

res.cookie("access_token", accessToken, {
  ...baseConfig,
  maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
});

res.cookie("refresh_token", refreshToken, {
  ...baseConfig,
  maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
});
};

//getAllShortlinks

export const getAllShortLinks = async (userId) => {
  const shortLink = await db.select().from(shortLinks).where(eq(shortLinks.userId, userId))
  return shortLink
}

export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1); // 10000000
  const max = 10 ** digit;       // 100000000

  return crypto.randomInt(min, max).toString();
};

// export const insertVerifyEmailToken = async ({ userId, token }) => {
//   await db.transaction(async (tx) => {
//     try {
//       await tx.delete(verifyEmailTokensTable).where(lt(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`));
//       await tx.delete(verifyEmailTokensTable).where(eq(verifyEmailTokensTable.userId, userId));

//       await tx.insert(verifyEmailTokensTable).values({
//         userId,
//         token,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour expiry
//         createdAt: new Date(),
//       });
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       throw error; // bubble up to trigger retry
//     }
//   });
// };
export const insertVerifyEmailToken = async ({ userId, token }) => {
  await db.transaction(async (tx) => {
    try {
      // Clean up expired tokens
      await tx.delete(verifyEmailTokensTable).where(
        lt(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`)
      );

      // Remove any existing token for this user
      await tx.delete(verifyEmailTokensTable).where(
        eq(verifyEmailTokensTable.userId, userId)
      );

      // Insert new token with 1-hour expiry
      await tx.insert(verifyEmailTokensTable).values({
        userId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        createdAt: new Date(),
      });

      console.log("✅ Token inserted:", token);
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      throw error;
    }
  });
};

export const createVerifyEmailLink = async ({ email, token }) => {
  // const uriEncodedEmail = encodeURIComponent(email)
  // return `${process.env.BASE_URL}/verifyEmailToken?token=${token}&email=${uriEncodedEmail}`  old version of learning


  const url = new URL(`${process.env.BASE_URL}/verifyEmailToken`)
  url.searchParams.append("token", token)
  url.searchParams.append("email", email)
  return url.toString()
}

// export const findVerifyEmailToken = async ({ token,email }) => {
//   const tokenData = await db
//     .select({
//       userId: verifyEmailTokensTable.userId,
//       token: verifyEmailTokensTable.token,
//       expiresAt: verifyEmailTokensTable.expiresAt,
//     })
//     .from(verifyEmailTokensTable)
//    .where(
// and(
//   eq(is_email_valid.token, token),
//   eq(is_email_valid.email, email), // ✅ Corrected
//   gte(is_email_valid.expiresAt, sql`CURRENT_TIMESTAMP`)
// )
// )

//   if (!tokenData.length) {
//     return null;
//   }

//   const { userId } = tokenData[0];

//   const userData = await db
//     .select({ userId: users.id, email: users.email })
//     .from(users)
//     .where(
//       eq(users.id, userId)
//     );

//   if (!userData.length) {
//     return null;
//   }

//   return {
//     userId: userData[0].id,
//     email: userData[0].email,
//     token: tokenData[0].token,
//     expiresAt: tokenData[0].expiresAt,
//   };
// };

//? export const findVerifyEmailToken = async ({ token, email }) => {  without joins
// console.log("Incoming token:", token);
// console.log("Incoming email:", email);

// const tokenData = await db
//   .select({
//     userId: verifyEmailTokensTable.userId,
//     token: verifyEmailTokensTable.token,
//     expiresAt: verifyEmailTokensTable.expiresAt,
//   })
//   .from(verifyEmailTokensTable)
//   .where(
//     and(
//       eq(verifyEmailTokensTable.token, token),
//       //gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`)
//     )
//   );

// console.log("Token data:", tokenData);
// if (!tokenData.length) {
//   console.log("❌ Token not found or expired");
//   return null;
// }

// const { userId } = tokenData[0];
// console.log("User ID from token:", userId);

// const userData = await db
//   .select({ id: users.id, email: users.email })
//   .from(users)
//   .where(
//     and(
//       eq(users.id, userId),
//       eq(users.email, email.trim().toLowerCase()) // normalize email
//     )
//   );

// console.log("User data:", userData);
// if (!userData.length) {
//   console.log("❌ User not found or email mismatch");
//   return null;
// }
//   return {
//     userId: userData[0].id,
//     email: userData[0].email,
//     token: tokenData[0].token,
//     expiresAt: tokenData[0].expiresAt,
//   };
// };
export const findVerifyEmailToken = async ({ token, email }) => {
  return db
    .select({
      userId: users.id,
      email: users.email,
      token: verifyEmailTokensTable.token,
      expiresAt: verifyEmailTokensTable.expiresAt,
    })
    .from(verifyEmailTokensTable)
    .where(
      and(
        eq(verifyEmailTokensTable.token, token),
        eq(users.email, email),
        //gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`)
      )
    ).innerJoin(users, eq(verifyEmailTokensTable.userId, users.id));

}
export const verifyEmailAndUpdate = async (email) => {
  return await db.update(users).set({ isEmailVerified: true }).where(eq(users.email, email))
}

export const clearVerifyEmailToken = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return await db.delete(verifyEmailTokensTable).where(eq(verifyEmailTokensTable.userId, user.id))
}

export const updateUserByName = async ({ userId, name }) => {
  return await db.update(users).set({ name: name }).where(eq(users.id, userId))
}


export const updateNewPassword = async ({ userId, newPassword }) => {
  const newHashPassword = await hashedPassword(newPassword)
  return await db.update(users).set({ password: newHashPassword }).where(eq(users.id, userId))
}

export const findUserbyEmail = async (email) => {
  return await db.select().from(users).where(eq(users.email, email))
} 

export const createResetPasswordLink = async (userId) => {
  const randomToken = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto.createHash("sha256").update(randomToken).digest("hex")
  await db.delete(passwordResetTokenTable).where(passwordResetTokenTable.id, userId)
  await db.insert(passwordResetTokenTable).values({ userId, tokenHash })
  return `${process.env.BASE_URL}/reset-password/${randomToken}`
}

export const checkResetPassword = async (token) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const data = await db.select().from(passwordResetTokenTable).where(eq(passwordResetTokenTable.tokenHash, tokenHash), gte(passwordResetTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`))
  return data
}

export const clearResetPasswordToken=async(userId)=>{
  return await db.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.userId,userId))
}

export const getUserWithOauthId=async({email,provider})=>{
const user=await db.select({
  id:users.id,
  name:users.name,
  email:users.email,
  isEmailVerified:users.isEmailVerified,
  providerAccountId:oauthAccountsTable.providerAccountId,
  provider:oauthAccountsTable.provider
})
.from(users)
.where(eq(users.email,email))
.leftJoin(oauthAccountsTable,and(
  eq(oauthAccountsTable.provider,provider),
  eq(oauthAccountsTable.userId,users.id)
))
return user
}

export const linkUserWithOauth=async({userId,provider,providerAccountId})=>{
  await db.insert(oauthAccountsTable).values({
    userId,provider,providerAccountId
  })
}

export const createUserWithOauth=async({name,email,provider,providerAccountId})=>{
const user = await db.transaction(async(trx)=>{
  const [user] = await trx.insert(users).values({email,name,password:"",isEmailVerified:true}).$returningId();

 await trx.insert(oauthAccountsTable).values({
  provider,providerAccountId,userId:user.id
 })

 return {
  id:user.id,
  name,
  email,
  isEmailVerified:true,
  provider,
  providerAccountId,
 }
})
return user
}