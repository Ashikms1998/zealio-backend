import express from "express";
const router = express.Router();
import { authController } from "../controllers/AuthController";
import { UserRepository } from "../../database/repository/UserRepository";
import { authService } from "../../services/UserService";
import { Mailer } from "../../external-libraries/mailer";
import { Bcrypt } from "../../external-libraries/bcrypt";
import { Token } from "../../external-libraries/Token";
import passport from "passport";
import { validateToken } from "../middleware/validateToken";
const repository = new UserRepository();
const bcrypt = new Bcrypt();
const mailer = new Mailer();
const token = new Token();
const auth = new authService(repository, bcrypt, mailer, token);
const controller = new authController(auth);
router.post("/signup", controller.userRegistration.bind(controller));
router.get("/verify-email", controller.userVerification.bind(controller));
router.post("/login", controller.onLoginUser.bind(controller));
router.post("/forgot-password", controller.ForgotPassword.bind(controller));
router.get("/otp", controller.passwordReset.bind(controller));
router.post("/otp", controller.passwordReset.bind(controller));
router.post("/resetpassword", controller.passwordChanging.bind(controller));
router.post("/admin-login", controller.adminLogin.bind(controller));
router.post("/userLog", controller.userList.bind(controller));
router.post("/resendOtp", controller.otpResend.bind(controller));
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  controller.authCallbackController.bind(controller)
);
router.get("/users/search", controller.userQuery.bind(controller));
router.put("/users/block-unblock", controller.checkBlocked.bind(controller));
router.post("/addtask",validateToken, controller.addTask.bind(controller));
router.get("/fetchTodo", controller.fetchingTasks.bind(controller));
router.delete("/deleteTask", controller.deleteTask.bind(controller));
router.put("/updateTaskCompleation",controller.updateTaskCompleation.bind(controller));
router.get("/userDetails",validateToken,controller.onUserFind.bind(controller))


export default router;
