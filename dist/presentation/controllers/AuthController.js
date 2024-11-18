"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const NodeMailer_1 = require("../../external-libraries/NodeMailer");
class authController {
    constructor(authService) {
        this.authService = authService;
    }
    userRegistration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const existingUser = yield this.authService.findUserByEmail(body.email);
                if (existingUser) {
                    if (!existingUser.verified) {
                        return res.status(409).json({
                            error: "Verification Link Already Send to The Given Mail",
                        });
                    }
                    return res
                        .status(409)
                        .json({ error: "User Already exits with given email " });
                }
                const data = yield this.authService.registerUser(body);
                return res.json(data);
            }
            catch (error) {
                console.error("Error during user registration:", error);
                return res
                    .status(500)
                    .json({ error: "An unexpected error occurred in user registration." });
            }
        });
    }
    userVerification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                const email = req.query.email;
                console.log("user verification", email, token);
                let result;
                if (token && email) {
                    result = yield this.authService.verifyUser(email, token);
                    console.log("user thenga verified", result);
                }
                if (result) {
                    console.log("redirected to ", `${process.env.CLIENT_URL}/verify-email?token=${token}`);
                    res.redirect(`${process.env.CLIENT_URL}/verify-email?token=${token}`);
                }
                else {
                    const error = "Invalid token";
                    res.redirect(`${process.env.CLIENT_URL}/verify-email?error=${error}`);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    onLoginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.authService.loginUser(email, password);
                if (user === null || user === void 0 ? void 0 : user.id) {
                    const { accessToken, refreshToken } = this.authService.generateToken(user.id);
                    if (accessToken && refreshToken) {
                        res.cookie("refreshToken", refreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 24 * 60 * 60 * 1000,
                        });
                        res.cookie("accessToken", accessToken, {
                            httpOnly: false,
                            secure: true,
                            sameSite: "none",
                            maxAge: 15 * 60 * 1000,
                        });
                        return res
                            .status(200)
                            .json({ message: "Sign-in successful", accessToken });
                    }
                    else {
                        return res.status(401).json({ error: "Invalid credentials" });
                    }
                }
                else {
                    return res.status(401).json({ error: "Invalid Credentials" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.authService.findUserByEmail(email);
                if (user) {
                    const generateRandomString = () => {
                        return Math.floor(100000 + Math.random() * 900000).toString();
                    };
                    const verify_token = generateRandomString();
                    console.log("Generated OTP is ", verify_token);
                    const mailer = yield NodeMailer_1.SendMail.sendmail(user.email, verify_token);
                    const otpUpdate = yield this.authService.otpUpdate(email, verify_token);
                    console.log(otpUpdate, "kasfjsd");
                    return res.status(200).json({ message: "Email Exist" });
                }
                else {
                    return res.status(404).json({ message: "email does not exist" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    passwordReset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body, "body exist");
                const verified = yield this.authService.checkingOtp(body.email, body.verify_token);
                console.log(verified, "kasfjsd");
                if (verified) {
                    return res
                        .status(200)
                        .json({
                        success: true,
                        message: "Email and OTP verification successfull",
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: "Incorrect OTP" });
                }
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({
                    success: false,
                    message: "An error occurred during OTP verification",
                });
            }
        });
    }
    passwordChanging(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log({ email, password }, "password exist");
                const changingPass = yield this.authService.changePassword(email, password);
                console.log(changingPass, "kasfjsd");
                if (changingPass) {
                    return res
                        .status(200)
                        .json({ message: "Password changed successfully" });
                }
                else {
                    return res.status(400).json({ message: "Password change failed" });
                }
            }
            catch (error) {
                console.error("Error changing password:", error);
                return res
                    .status(500)
                    .json({
                    message: "An error occurred while changing password",
                    errorDetails: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log(email, password, "admin Em and pass");
                const admin = yield this.authService.adminLogin(email, password);
                if (admin) {
                    return res.status(200).json({ message: "Admin Sign-in successful" });
                }
                else {
                    return res.status(401).json({ error: "Invalid credentials" });
                }
            }
            catch (error) {
                console.error("Error during admin login:", error);
                return res
                    .status(500)
                    .json({
                    message: "An error occurred during sign-in",
                    errorDetails: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    userList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.allUsers();
                res
                    .status(200)
                    .json({ message: "Users retrieved successfully", data: response });
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    message: "An error occurred while retrieving users",
                    errorDetails: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    userQuery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchTerm = req.query.q;
                console.log(searchTerm, "searchTerm");
                const response = yield this.authService.searchedUsers(searchTerm);
                res
                    .status(200)
                    .json({ message: "Users retrieved successfully", data: response });
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    message: "An error occurred while retrieving searched users",
                    errorDetails: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    otpResend(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.authService.findUserByEmail(email);
                if (user) {
                    const generateRandomString = () => {
                        return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
                    };
                    const verify_token = generateRandomString();
                    console.log("Generated OTP is ", verify_token);
                    const mailer = yield NodeMailer_1.SendMail.sendmail(user.email, verify_token);
                    const otpUpdate = yield this.authService.otpUpdate(email, verify_token);
                    console.log(otpUpdate, "kasfjsd");
                    return res.status(200).json({ message: "Email Exist" });
                }
                else {
                    return res.status(404).json({ message: "email does not exist" });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    authCallbackController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "Authentication failed" });
                }
                const { accessToken, refreshToken } = this.authService.generateToken(user.id);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.cookie("accessToken", accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 1000,
                });
                return res.redirect(`${process.env.CLIENT_URL}/home?accessToken=${accessToken}`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkBlocked(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, isBlocked } = req.body;
                console.log(userId, isBlocked, "user id send from front for blocking");
                const updatedUser = yield this.authService.checkBlocked(userId, isBlocked);
                if (updatedUser) {
                    return res.status(200).json({
                        message: `User ${updatedUser.isBlocked ? "blocked" : "unblocked"} successfully`,
                        data: updatedUser,
                    });
                }
                else {
                    return res.status(404).json({ message: "User not found" });
                }
            }
            catch (error) {
                console.error("Error during blocking/unblocking user:", error);
                return res
                    .status(500)
                    .json({
                    error: "An error occurred while blocking/unblocking the user.",
                });
            }
        });
    }
    addTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { task, userId } = req.body;
                const todoUpdate = yield this.authService.todoUpdate(userId, task);
                if (todoUpdate) {
                    res.status(201).json(todoUpdate);
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
            }
            catch (error) {
                if (error.status === 409) {
                    return res.status(409).json({ error: "Task already exists" });
                }
                console.error("Error during adding todo task:", error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while adding todo task." });
            }
        });
    }
    fetchingTasks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                console.log("🤯", userId);
                const todoList = yield this.authService.todoList(userId);
                console.log("🤯", todoList);
                if (todoList) {
                    res.status(201).json(todoList);
                }
                else {
                    res.status(404).json({ error: "todoList not found" });
                }
            }
            catch (error) {
                console.error("Error during fetching todoList:", error);
                return res
                    .status(500)
                    .json({ error: "An error occurred during fetching todoList." });
            }
        });
    }
    deleteTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const TaskId = req.query._id;
                const userId = req.query.userId;
                if (!TaskId || !userId) {
                    return res
                        .status(400)
                        .json({ message: "Task ID or User ID is missing" });
                }
                const deletedTask = yield this.authService.deletingTask(TaskId, userId);
                if (!deletedTask) {
                    return res
                        .status(404)
                        .json({ message: "Task not found or unauthorized action" });
                }
                res
                    .status(200)
                    .json({ message: "Task deleted successfully", deletedTask });
            }
            catch (error) {
                console.log("Error during deleting task", error);
                res.status(500).json({ message: "Error deleting task" });
            }
        });
    }
    updateTaskCompleation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const TaskId = req.query._id;
                const userId = req.query.userId;
                if (!TaskId || !userId) {
                    return res
                        .status(400)
                        .json({ message: "Task ID or User ID is missing" });
                }
                const taskStriked = yield this.authService.strikeTask(TaskId, userId);
                if (!taskStriked) {
                    return res
                        .status(404)
                        .json({ message: "Task not found or unauthorized action" });
                }
                res
                    .status(200)
                    .json({ message: "Task deleted successfully", taskStriked });
            }
            catch (error) {
                console.log("Error during striking task", error);
                res.status(500).json({ message: "Error striking task" });
            }
        });
    }
    onUserFind(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const user = yield this.authService.findUserById(userId);
                let data = {
                    id: user === null || user === void 0 ? void 0 : user.id,
                    firstName: user === null || user === void 0 ? void 0 : user.firstName,
                    lastName: user === null || user === void 0 ? void 0 : user.lastName,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    verified: user === null || user === void 0 ? void 0 : user.verified,
                    isBlocked: user === null || user === void 0 ? void 0 : user.isBlocked,
                };
                return res.json(data);
            }
            catch (error) {
                console.log(error, "Error finding the user from onUserFind");
            }
        });
    }
    onLogout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(200).json({ success: true, message: "User Logged Out Successfully" });
            }
            catch (error) {
                console.log("Error while logging out", error);
                next(error);
            }
        });
    }
}
exports.authController = authController;
