import { Router } from "express";
import * as authController from "../controller/auth.controller.js"
const routeAuth=Router()

// routeAuth.get("/register",authController.getRegistrationPage)
// route.get("/login",authController.getLoginPage)
routeAuth.route("/register").get(authController.getRegistrationPage).post(authController.PostRegister)
routeAuth.route("/login").get(authController.getLoginPage).post(authController.PostLogin)
routeAuth.route("/me").get(authController.getme)
routeAuth.route("/profile").get(authController.getProfilePage)
routeAuth.route("/verifyEmail").get(authController.verifyEmail)
routeAuth.route("/resendVerification").get(authController.resendVerification)
routeAuth.route("/verifyEmailToken").get(authController.verifyEmailTokenData)
routeAuth.route("/edit-profile").get(authController.EditProfile).post(authController.postEditProfile)
routeAuth.route("/change-password").get(authController.ChangePassword).post(authController.PostChangePassword)
routeAuth.route("/forget-password").get(authController.forgetPassword).post(authController.PostforgetPassword)
routeAuth.route("/reset-password/:token").get(authController.ResetPassword).post(authController.postResetPassword)
routeAuth.route("/logout").get(authController.logout)
routeAuth.route("/google").get(authController.getGoogleLoginPage)
routeAuth.route("/google/callback").get(authController.getGoogleLoginCallbackPage)
routeAuth.route("/set-password").get(authController.setPasswordPage).post(authController.postSetPassordPage)
export default routeAuth 