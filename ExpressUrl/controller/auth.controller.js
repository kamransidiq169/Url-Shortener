
import { emailVerificationSchema, forgetPasswordSchema, resetPasswordSchema, setPasswordSchema, userLoginSchema, userRegistrationSchema, verifyPasswordSchema, verifyUserSchema } from "../auth-verification.js"
import { sendEmail } from "../lib/sendEmail.js"
import { authenticateUser, checkResetPassword, clearResetPasswordToken, clearUserSession, clearVerifyEmailToken, comparePassword, createAccessToken, createRefreshToken, createResetPasswordLink, createSession, createUserWithOauth, createValues, createVerifyEmailLink, findUserbyEmail, findUserById, findVerifyEmailToken, generateRandomToken, getAllShortLinks, getEmail, getUserWithOauthId, hashedPassword, insertVerifyEmailToken, linkUserWithOauth, updateNewPassword, updateUserByName, verifyEmailAndUpdate } from "../services/auth.services.js"
import fs from 'fs/promises'
import path from 'path'
import ejs from 'ejs'
import mjml2html from 'mjml'
import { getHtmlfromMjmlTemplate } from "../lib/get-html-from-mjml-template.js"
import {decodeIdToken, generateCodeVerifier, generateState} from 'arctic'
import { google } from "../lib/oauth/google.js"

export const getRegistrationPage = (req, res) => {
  return res.render("auth/register", { errors: req.flash("errors") })
}
export const getLoginPage = (req, res) => {
  return res.render("auth/login", { errors: req.flash("errors") })
}

export const PostRegister = async (req, res) => {
  // const {name,email,password}=req.body
  const { data, error } = userRegistrationSchema.safeParse(req.body)
if (error) {
  req.flash("errors", "invalid give perfect details");
  return res.redirect("/register"); // ✅ return added
}



if (!data) {
  return res.status(400).json({ error: "Missing registration data" });
}

const { name, email, password } = data;


 const result = await getEmail({ email });
const userEmail = result?.[0] || null;

  const hashPassword = await hashedPassword(password)

if (userEmail) {
  req.flash("errors", "User already exists");
  return res.redirect("/register"); // ✅ return added
}


  const userData = await createValues({ name, email, password: hashPassword })
  console.log(userData);
 await authenticateUser({ req, res, user:userData, name, email });

 return res.redirect("/login")

}

export const PostLogin = async (req, res) => {
  // res.setHeader("Set-Cookie","isLoggedIn=true; path=/;")
  //! hum ab cookie parser middleware use karengai


  //const {email,password}=req.body
  const { data, error } = userLoginSchema.safeParse(req.body)
  // console.log(error);

  if (error) {
    req.flash("errors", 'invalid email or password')
   return res.redirect("/login")
  }

  const { email, password } = data
  const [userEmail] = await getEmail({ email })

  if (!userEmail) {
    req.flash("errors", "Invalid email and password")
    return res.redirect("/login")
  }

  // if(userEmail.password !== password){
  //     return   res.redirect("/login")
  // }
  //! parameter mai yaha pe dou password dene hote hai ayek tou simple password jo tumne likha aur wo jo store hai
  const isPasswordValid = await comparePassword(password, userEmail.password)

  if (!isPasswordValid) return res.redirect("/login")


  // res.cookie("isLoggedIn",true) // by default ye path / ko rakhta hai

  // const token = generateToken({
  //     id: userEmail.id,
  //     name: userEmail.name,
  //     email: userEmail.email
  // })

  // res.cookie("Access_Token", token)


  const [session] = await createSession(userEmail.id, {
    ip: req.clientIp,
    userAgent: req.headers["user_agent"]
  })


  const accessToken = createAccessToken({
    id: userEmail.id,
    name: userEmail.name,
    email: userEmail.email,
    sessionId: session.id,
    isEmailVerified: false
  })

  const refreshToken = createRefreshToken(session.id)


  const baseConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in prod
  };
  // issai hum mtlb hum isko secure karte hai

  res.cookie("Access_Token", accessToken, baseConfig)
  res.cookie("Refresh_Token", refreshToken, baseConfig)

  res.redirect("/")
}

export const getme = (req, res) => {
  if (!req.user) return res.send('not logged in')
  return res.send(`hi ${req.user.name} and your email is ${req.user.email}`)
}

export const getProfilePage = async (req, res) => {
  if (!req.user) return res.send("not logged in")

  const [user] = await findUserById(req.user.id)

  if (!user) return res.send("/login")

  const userShortLinks = await getAllShortLinks(user.id)

  return res.render("auth/profile", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      hashPassword: !!user.password,
      createdAt: user.createdAt,
      shortlinks: userShortLinks, // ✅ fixed key
      isEmailVerified: user.isEmailVerified,
    }
  });

}

export const logout = async (req, res) => {

  await clearUserSession(req.user.sessionId)

  res.clearCookie("Access_Token")
  res.clearCookie("Refresh_Token")
  res.redirect("/login")
}

export const verifyEmail = async (req, res) => {
  if (!req.user) return res.redirect("/login")
  return res.render("auth/verifyEmail")
}


export const resendVerification = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const [user] = await findUserById(req.user.id);
    if (!user || user.isEmailVerified) return res.redirect("/login");

    const randomToken = generateRandomToken();

    const MAX_RETRIES = 3;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        await insertVerifyEmailToken({ userId: req.user.id, token: randomToken });
        break;
      } catch (err) {
        if (err.code === 'ER_LOCK_WAIT_TIMEOUT' && i < MAX_RETRIES - 1) {
          console.warn(`Retrying insertVerifyEmailToken (${i + 1}/${MAX_RETRIES})...`);
          await new Promise(res => setTimeout(res, 1000));
        } else {
          console.error("Insert token failed:", err);
          return res.status(500).send("Server error. Please try again.");
        }
      }
    }

    // Retry logic here...

    const verifyEmailLink = await createVerifyEmailLink({ email: req.user.email, token: randomToken });


    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname, "..", "emails", "verifyemail.mjml"), 'utf-8')

    const filledTemplate = ejs.render(mjmlTemplate, {
      code: randomToken,
      link: verifyEmailLink,
    })

    const htmlOutput = mjml2html(filledTemplate).html

    await sendEmail({
      to: req.user.email,
      subject: "Verify your email",
      html: htmlOutput,
    });

    res.redirect("/verifyEmail");
  } catch (err) {
    console.error("Resend verification failed:", err);
    res.status(500).send("Something went wrong.");
  }
};

export const verifyEmailTokenData = async (req, res) => {
  const { data, error } = emailVerificationSchema.safeParse(req.query);

  // console.log(req.query);
  console.log(data);


  if (error) {
    return res.send("Verification link invalid or expired.")
  }

  // console.log(token);
  // console.log(email);


  const [verifyToken] = await findVerifyEmailToken(data);

  console.log(verifyToken);


  if (!verifyToken) {
    return res.redirect("/verifyEmail");
  }

  await verifyEmailAndUpdate(verifyToken.email);
  await clearVerifyEmailToken(verifyToken.email);

  return res.redirect("/profile");
};

export const EditProfile = async (req, res) => {
  if (!req.user) return res.redirect("/")
  const [user] = await findUserById(req.user.id)

  if (!user) return res.status(400).send("user not found")

  return res.render("auth/edit-profile", {
    name: user.name,
    success: req.flash("success"),
    errors: req.flash("errors")
  })
}

export const postEditProfile = async (req, res) => {
  if (!req.user) return res.redirect("/")
  const { data, error } = verifyUserSchema.safeParse(req.body)

  if (error) {
    console.error(error);
    return res.redirect("/edit-profile")
  }
  await updateUserByName({ userId: req.user.id, name: data.name })
  return res.redirect("/profile")
}

// export const ChangePassword=async(req,res)=>{
//   if(!req.user) return res.redirect("/")

//     res.render("auth/change-password",{
//       errors : req.flash("errors")
//     })
// }
export const ChangePassword = async (req, res) => {
  if (!req.user) return res.redirect("/");

  const errors = req.flash("errors");
  res.render("auth/change-password", {
    errors,
    user: req.user, // optional: if you're using `user` in your EJS
  });
};
export const PostChangePassword = async (req, res) => {
  const { data, error } = verifyPasswordSchema.safeParse(req.body)

  if (error) {
    const errorMessage = error?.errors?.map((err) => err.message) || ["Invalid input"];
    req.flash("errors", errorMessage)
    return res.redirect("/change-password")
  }

  const { currentPassword, newPassword } = data

  const [user] = await findUserById(req.user.id)
  if (!user) return res.status(404).send("user not found")

    if(!user.password){
      req.flash("errors","You have created account using social login,Please login with our social account")
      res.redirect("/login")
    }

  const compareCurrentPassword = await comparePassword(currentPassword, user.password)

  if (!compareCurrentPassword) {
    req.flash("errors", "current password you entered is invalid")
    res.redirect("/change-password")
  }

  await updateNewPassword({ userId: user.id, newPassword })
  req.flash("success", "Password changed successfully");

  res.redirect("/profile")
}

export const forgetPassword = async (req, res) => {
  return res.render("auth/forget-password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors")
  })
}

export const PostforgetPassword = async (req, res) => {
  const { data, error } = forgetPasswordSchema.safeParse(req.body)
  if (error) {
    const errorMessage = error?.errors?.map((err) => err.message) || ["Invalid input"];
    req.flash("errors", errorMessage[0])
    return res.redirect("/forget-password")
  }

  const [user] = await findUserbyEmail(data.email)

  const resetPasswordLink = await createResetPasswordLink(user.id)

  const html = await getHtmlfromMjmlTemplate('reset-password-email', {
    name: user.name,
    link: resetPasswordLink
  })
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html,
  });
  req.flash("formSubmitted", true);
  res.redirect("/forget-password");
}

export const ResetPassword = async (req, res) => {
  const { token } = req.params;

  const [getResetPassword] = await checkResetPassword(token)

  if (!getResetPassword) {
    req.flash("errors", "Token expired or invalid");
  }

  return res.render("auth/reset-Password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors"),
    token
  })
}

export const postResetPassword = async (req, res) => {
  const { token } = req.params;

  const [getResetPassword] = await checkResetPassword(token)
  if (!getResetPassword) {
    req.flash("errors", "Token expired or invalid");
  }

  const {data,error}=resetPasswordSchema.safeParse(req.body)
     if (error) {
    const errorMessage = error?.errors?.map((err) => err.message) || ["Invalid input"];
    req.flash("errors", errorMessage[0])
    return res.redirect("/reset-password")
  }
  const {newPassword}=data
  const [user]= await findUserById(getResetPassword.userId)
  await clearResetPasswordToken(user.id)
  await updateNewPassword({userId: user.id, newPassword})
  res.redirect("/login")
}

export const getGoogleLoginPage=async(req,res)=>{
  if(req.user) return res.redirect("/")
    const state = generateState()
  const codeVerifier=generateCodeVerifier()
 const url = google.createAuthorizationURL(state, codeVerifier, [
  "openid", "profile", "email"
], {
  redirect_uri: "http://localhost:3000/google/callback"
});
  const baseConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in prod
  };
  res.cookie("google_oauth_state",state,baseConfig)
  res.cookie("google_code_verifier",codeVerifier,baseConfig)
  console.log("Google OAuth URL:", url.toString());
  res.redirect(url.toString())
}

export const getGoogleLoginCallbackPage=async(req,res)=>{
  const {code,state}=req.query

  const{google_oauth_state:storedState,google_code_verifier:codeVerifier}=req.cookies

  if(!code|| !state || !storedState || !codeVerifier || state !== storedState
  ){
    req.flash("errors","couldn't login with google because of invalid attempt. Please try again")
    return res.redirect("/login")
  }

  let tokens;

  try {
    tokens = await google.validateAuthorizationCode(code,codeVerifier)
  } catch (error) {
  req.flash("errors","couldn't login with google because of invalid attempt. Please try again")
    return res.redirect("/login")
  }
 
const claims = decodeIdToken(tokens.idToken())

const {sub:googleUserId,name,email}=claims
let [user] = await getUserWithOauthId({
  provider:"google",
  email,
})

if(user && !user.providerAccountId){
  await linkUserWithOauth({ 
    userId:user.id,
    provider:"google",
    providerAccountId: googleUserId,
  })
}

if(!user){
 user = await createUserWithOauth({
  name,email,provider:"google",providerAccountId:googleUserId
 })
}

await authenticateUser({req,res,user,name,email})
res.redirect("/")
}

export const setPasswordPage=async(req,res)=>{
     if(!req.user) return res.redirect("/")
      res.render("auth/set-password",{
        errors: req.flash("errors"),
      })
}

export const postSetPassordPage=async(req,res)=>{
   if(!req.user) return res.redirect("/")
  const {data,error}=setPasswordSchema.safeParse(req.body)
  if (error) {
    const errorMessage = error?.errors?.map((err) => err.message) || ["Invalid input"];
    req.flash("errors", errorMessage[0])
    return res.redirect("/set-password")
  }

  const {newPassword}=data

  const [user]=await findUserById(req.user.id)

  if(user.password){
    req.flash("errors","You already have password you dont need to set password")
    res.redirect("/")
  }

  await updateNewPassword({userId:user.id,newPassword})
}