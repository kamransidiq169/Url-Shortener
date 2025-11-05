import { refreshTokens, verifyJWTToken } from "../services/auth.services.js";

// export const verifyAuthentication=(req,res,next)=>{
// const token=req.cookies.Access_Token
//  if(!token){
//     req.user=null;
//     return next()
//  }
//  try {
//     const decodedToken=verifyJWTToken(token)
//     req.user=decodedToken
//     console.log(`req user`,req.user);

//  } catch (error) {
//      req.user=null;
//  }
//  return next()
// }

export const verifyAuthentication = async (req, res, next) => {
   const accessToken = req.cookies.access_token
   const refreshToken = req.cookies.refresh_token
   req.user = null
   if (accessToken) {
      try {
         const decoded = verifyJWTToken(accessToken, process.env.SECRET_KEY);
         req.user = decoded;
         return next();
      } catch (error) {
         if (error.name === "TokenExpiredError") {
            console.log("Access token expired, trying refresh...");
            // continue to refreshToken block
         } else {
            console.log("Access token invalid:", error.message);
            return next();
         }
      }
   }

   if (refreshToken) {
      try {
         const { newAccesstoken, newRefreshtoken, user } = await refreshTokens(refreshToken)
         req.user = user

         const baseConfig = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only true in prod
         };// issai hum mtlb hum isko secure karte hai

         res.cookie("Access_Token", newAccesstoken, baseConfig)
         res.cookie("Refresh_Token", newRefreshtoken, baseConfig)

         return next()
      } catch (error) {
         console.log("Refresh token failed:", error.message);
         req.user = null;
      }
   }
   return next()
}