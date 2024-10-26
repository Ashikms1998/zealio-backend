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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const uuid_1 = require("uuid");
const emailTemplate_1 = __importDefault(require("../presentation/utils/emailTemplate"));
class authService {
    constructor(repository, bcrypt, mailer, token) {
        this.repository = repository;
        this.bcrypt = bcrypt;
        this.mailer = mailer;
        this.token = token;
    }
    findUserByEmail(email) {
        const user = this.repository.findByEmail(email);
        return user;
    }
    // async resetPassword(email:string): Promise<User | null> {
    //     const token = uuidv4()
    //     const verify_token = token;
    //     const data = await this.repository.changePassword(verify_token,email);
    //     console.log(data,"resetting data");
    //     if (!data) {
    //         throw new Error("User not found");
    //       }
    //     const html = emailTemplate(data.firstName,data.lastName,data.email,token);
    //     this.mailer.SendEmail(data.email,html)
    //     return data
    // }
    registerUser(input, type) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (input.password) {
                const hashedPassword = yield this.bcrypt.Encrypt(input.password);
                input.password = hashedPassword;
            }
            const token = (0, uuid_1.v4)();
            input.verify_token = token;
            const data = yield this.repository.create(input);
            console.log(data, "Us data");
            if (type) {
                return data;
            }
            else {
                const email = data.email;
                const html = (0, emailTemplate_1.default)(data.firstName, (_a = data.lastName) !== null && _a !== void 0 ? _a : "", email, token);
                this.mailer.SendEmail(email, html);
                return data;
            }
        });
    }
    verifyUser(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (user) {
                console.log(user, user.verify_token, token, "All the cup cap");
                if (user.verify_token === token) {
                    const data = {
                        verified: true,
                    };
                    console.log(data, user.id, "updtae nu munp yaya");
                    const update = yield this.repository.update(user.id, data);
                    console.log(update, "yaya");
                    if (update) {
                        return update;
                    }
                }
            }
            return null;
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (!user) {
                return null;
            }
            if (user.password && user.verified) {
                const isPasswordCorrect = yield this.bcrypt.compare(password, user.password);
                if (isPasswordCorrect) {
                    console.log(user, "zustand data item to be");
                    return user;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    generateToken(userId) {
        return this.token.generatingTokens(userId);
    }
    otpUpdate(email, verify_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (!user) {
                return null;
            }
            const update = yield this.repository.otpupdate(email, verify_token);
            console.log(update, "US item 4 10");
            return update;
        });
    }
    checkingOtp(email, verify_token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.findUserByEmail(email);
                if (!user) {
                    return false;
                }
                let checkOtp = yield this.repository.otpCheck(email, verify_token);
                console.log(checkOtp, "OTP checked");
                return !!checkOtp;
            }
            catch (error) {
                console.error("Error during OTP checking:", error);
                return false;
            }
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (!user) {
                return null;
            }
            const hashedPassword = yield this.bcrypt.Encrypt(password);
            let changeingPasscode = yield this.repository.changePasscode(user.id, hashedPassword);
            console.log(changeingPasscode, "OTP checked");
            if (changeingPasscode) {
                return changeingPasscode;
            }
            else {
                console.error("changeingPasscode  failed");
                return null;
            }
        });
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.repository.findAdminByEmail(email);
                if (!admin) {
                    return null;
                }
                if (admin.password === password) {
                    return admin;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error during admin login:", error);
                return null;
            }
        });
    }
    allUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const newuser = yield this.repository.findUsers();
            return newuser;
        });
    }
    searchedUsers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqestedUsers = yield this.repository.searchedUsers(searchTerm);
            return reqestedUsers;
        });
    }
    checkBlocked(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, isBlocked, "checkBlocked");
                const updatedUser = yield this.repository.isBlocked(userId, isBlocked);
                console.log(updatedUser, "checkBlockedupdatedUser");
                return updatedUser;
            }
            catch (error) {
                console.error("Error in service while toggling block status:", error);
                return null;
            }
        });
    }
    todoUpdate(userId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repository.findById(userId);
                if (!user) {
                    return null;
                }
                const existingTask = yield this.repository.findOne(userId, task);
                if (existingTask) {
                    throw new Error('Duplicate Task');
                }
                const userTask = yield this.repository.updateTodo(userId, task);
                return userTask;
            }
            catch (error) {
                if (error.message === "Duplicate Task") {
                    throw { status: 409, message: 'Task already exists' };
                }
                console.error("Error during updating todo:", error);
                throw error;
            }
        });
    }
    todoList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repository.findById(userId);
                if (!user) {
                    return null;
                }
                const todoList = yield this.repository.fetchTodo(userId);
                return todoList;
            }
            catch (error) {
                console.error("Error fetching todoList:", error);
                throw error;
            }
        });
    }
    deletingTask(TaskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repository.findById(userId);
                if (!user) {
                    return null;
                }
                const deleteTask = yield this.repository.updateTaskList(userId, TaskId);
                if (!deleteTask) {
                    return null;
                }
                return deleteTask;
            }
            catch (error) {
                console.error("Error during deleting task:", error);
                throw error;
            }
        });
    }
    strikeTask(TaskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repository.findById(userId);
                if (!user) {
                    return null;
                }
                const strikedTask = yield this.repository.updateTaskCompleation(userId, TaskId);
                if (!strikedTask) {
                    return null;
                }
                return strikedTask;
            }
            catch (error) {
                console.error("Error during deleting task:", error);
                throw error;
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findById(userId);
            return user;
        });
    }
}
exports.authService = authService;
