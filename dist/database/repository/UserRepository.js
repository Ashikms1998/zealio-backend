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
exports.UserRepository = void 0;
const UserSchema_1 = require("../models/UserSchema");
const AdminSchema_1 = require("../models/AdminSchema");
const TodoSchema_1 = require("../models/TodoSchema");
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const user = yield UserSchema_1.User.findOne({ email: email });
            if (user) {
                const userData = {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: (_a = user.lastName) !== null && _a !== void 0 ? _a : "",
                    email: user.email,
                    password: (_b = user.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: (_c = user.verify_token) !== null && _c !== void 0 ? _c : "",
                    verified: user.verified,
                    isBlocked: (_d = user.isBlocked) !== null && _d !== void 0 ? _d : false
                };
                return userData;
            }
            return null;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const newUserData = yield UserSchema_1.User.create(data);
            const newUser = {
                id: newUserData._id.toString(),
                firstName: newUserData.firstName,
                lastName: (_a = newUserData.lastName) !== null && _a !== void 0 ? _a : "",
                email: newUserData.email,
                password: (_b = newUserData.password) !== null && _b !== void 0 ? _b : "",
                verify_token: (_c = newUserData.verify_token) !== null && _c !== void 0 ? _c : "",
                verified: newUserData.verified,
                isBlocked: (_d = newUserData.isBlocked) !== null && _d !== void 0 ? _d : false
            };
            return newUser;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            console.log(id, data, "UPDATE IL KERI VRO");
            const updatedUser = yield UserSchema_1.User.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
            console.log(updatedUser, "updatedUser IL KERI VRO");
            if (updatedUser) {
                return {
                    id: updatedUser._id.toString(),
                    firstName: updatedUser.firstName,
                    lastName: (_a = updatedUser.lastName) !== null && _a !== void 0 ? _a : "",
                    email: updatedUser.email,
                    password: (_b = updatedUser.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: (_c = updatedUser.verify_token) !== null && _c !== void 0 ? _c : "",
                    verified: updatedUser.verified,
                    isBlocked: (_d = updatedUser.isBlocked) !== null && _d !== void 0 ? _d : false
                };
            }
            return null;
        });
    }
    // async changePassword(email:string,verify_token:string): Promise<User | null> {
    //         const newUserData = await ForgotPassword.create({email,verify_token})
    //         const userData: ForgotPasswordEntity = {
    //                 email:newUserData.email,
    //                 verify_token:newUserData.verify_token
    //             }
    //             return userData
    //         }
    otpupdate(email, verify_token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const updatedUser = yield UserSchema_1.User.findOneAndUpdate({ email: email }, { $set: { verify_token } }, { new: true });
            if (updatedUser) {
                return {
                    id: updatedUser._id.toString(),
                    firstName: updatedUser.firstName,
                    lastName: (_a = updatedUser.lastName) !== null && _a !== void 0 ? _a : "",
                    email: updatedUser.email,
                    password: (_b = updatedUser.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: (_c = updatedUser.verify_token) !== null && _c !== void 0 ? _c : "",
                    verified: updatedUser.verified,
                    isBlocked: (_d = updatedUser.isBlocked) !== null && _d !== void 0 ? _d : false
                };
            }
            return null;
        });
    }
    otpCheck(email, verify_token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userDoc = yield UserSchema_1.User.findOne({ email: email });
            if (userDoc && verify_token === userDoc.verify_token) {
                const userData = {
                    id: userDoc._id.toString(),
                    firstName: userDoc.firstName,
                    lastName: (_a = userDoc.lastName) !== null && _a !== void 0 ? _a : "",
                    email: userDoc.email,
                    password: (_b = userDoc.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: userDoc.verify_token,
                    verified: userDoc.verified,
                    isBlocked: (_c = userDoc.isBlocked) !== null && _c !== void 0 ? _c : false
                };
                return userData;
            }
            return null;
        });
    }
    changePasscode(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const updatedUser = yield UserSchema_1.User.findOneAndUpdate({ _id: id }, { $set: { password: hashedPassword } }, { new: true });
            if (updatedUser) {
                return {
                    id: updatedUser._id.toString(),
                    firstName: updatedUser.firstName,
                    lastName: (_a = updatedUser.lastName) !== null && _a !== void 0 ? _a : "",
                    email: updatedUser.email,
                    password: (_b = updatedUser.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: (_c = updatedUser.verify_token) !== null && _c !== void 0 ? _c : "",
                    verified: updatedUser.verified,
                    isBlocked: (_d = updatedUser.isBlocked) !== null && _d !== void 0 ? _d : false
                };
            }
            return null;
        });
    }
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield AdminSchema_1.Admin.findOne({ email: email });
            if (admin) {
                const adminData = {
                    id: admin._id.toString(),
                    email: admin.email,
                    password: admin.password,
                };
                return adminData;
            }
            return null;
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const user = yield UserSchema_1.User.findById(userId);
                if (user) {
                    return {
                        id: user._id.toString(),
                        firstName: user.firstName,
                        lastName: (_a = user.lastName) !== null && _a !== void 0 ? _a : "",
                        email: user.email,
                        password: (_b = user.password) !== null && _b !== void 0 ? _b : "",
                        verify_token: (_c = user.verify_token) !== null && _c !== void 0 ? _c : "",
                        verified: user.verified,
                        isBlocked: (_d = user.isBlocked) !== null && _d !== void 0 ? _d : false
                    };
                }
                return null;
            }
            catch (error) {
                console.error("Error during finding user by id:", error);
                return null;
            }
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield UserSchema_1.User.find();
                const users = documents.map((doc) => {
                    var _a, _b, _c, _d;
                    return {
                        id: doc._id.toString(),
                        firstName: doc.firstName,
                        lastName: (_a = doc.lastName) !== null && _a !== void 0 ? _a : "",
                        email: doc.email,
                        password: (_b = doc.password) !== null && _b !== void 0 ? _b : "",
                        verify_token: (_c = doc.verify_token) !== null && _c !== void 0 ? _c : "",
                        verified: doc.verified,
                        isBlocked: (_d = doc.isBlocked) !== null && _d !== void 0 ? _d : false
                    };
                });
                return users.length > 0 ? users : null;
            }
            catch (error) {
                console.error("Error during finding all users:", error);
                return null;
            }
        });
    }
    searchedUsers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield UserSchema_1.User.find({
                    $or: [
                        { firstName: { $regex: searchTerm, $options: "i" } },
                        { lastName: { $regex: searchTerm, $options: "i" } },
                        { email: { $regex: searchTerm, $options: "i" } }
                    ]
                });
                const users = documents.map((doc) => {
                    var _a, _b, _c, _d;
                    return {
                        id: doc._id.toString(),
                        firstName: doc.firstName,
                        lastName: (_a = doc.lastName) !== null && _a !== void 0 ? _a : "",
                        email: doc.email,
                        password: (_b = doc.password) !== null && _b !== void 0 ? _b : "",
                        verify_token: (_c = doc.verify_token) !== null && _c !== void 0 ? _c : "",
                        verified: doc.verified,
                        isBlocked: (_d = doc.isBlocked) !== null && _d !== void 0 ? _d : false
                    };
                });
                return users;
            }
            catch (error) {
                console.error("Error during finding requested users:", error);
                return null;
            }
        });
    }
    createOrUpdateGoogleUser(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield UserSchema_1.User.findOne({ googleId: profile.id });
                console.log(existingUser, "existing User");
                if (existingUser) {
                    return existingUser;
                }
                else {
                    const userByEmail = yield UserSchema_1.User.findOne({
                        email: profile.emails[0].value,
                    });
                    console.log(userByEmail, "userByEmail");
                    if (userByEmail) {
                        userByEmail.googleId = profile.id;
                        yield userByEmail.save();
                        return userByEmail;
                    }
                    else {
                        const newUser = new UserSchema_1.User({
                            firstName: profile.displayName.split(" ")[0],
                            lastName: profile.displayName.split(" ").slice(1).join(" ") || "",
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            verified: true,
                        });
                        console.log(newUser, "newUser");
                        yield newUser.save();
                        return newUser;
                    }
                }
            }
            catch (error) {
                console.error("the error with db : ", error);
            }
        });
    }
    isBlocked(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const updatedDoc = yield UserSchema_1.User.findByIdAndUpdate(userId, { isBlocked: isBlocked }, { new: true });
                if (!updatedDoc) {
                    return null;
                }
                const updatedUser = {
                    id: updatedDoc._id.toString(),
                    firstName: updatedDoc.firstName,
                    lastName: (_a = updatedDoc.lastName) !== null && _a !== void 0 ? _a : "",
                    email: updatedDoc.email,
                    password: (_b = updatedDoc.password) !== null && _b !== void 0 ? _b : "",
                    verify_token: (_c = updatedDoc.verify_token) !== null && _c !== void 0 ? _c : "",
                    verified: updatedDoc.verified,
                    isBlocked: isBlocked
                };
                return updatedUser;
            }
            catch (error) {
                console.error("Error during blocking/unblocking user:", error);
                return null;
            }
        });
    }
    updateTodo(userId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTodo = new TodoSchema_1.Todo({
                    task: task,
                    completed: false,
                    userId: userId
                });
                yield newTodo.save();
                return newTodo;
            }
            catch (error) {
                console.error("Error during adding Task:", error);
                return null;
            }
        });
    }
    fetchTodo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let taskList = TodoSchema_1.Todo.find({ userId: userId }).sort({ completed: 1 });
                return taskList;
            }
            catch (error) {
                console.error("Error during fetching todo task:", error);
                return null;
            }
        });
    }
    updateTaskList(userId, TaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, TaskId, "delete aakkan ullath back iol kitty last");
                const deletedTask = yield TodoSchema_1.Todo.findOneAndDelete({ _id: TaskId, userId });
                console.log(deletedTask, "delete aakkan ullath back iol kitty last");
                if (!deletedTask) {
                    return null;
                }
                return deletedTask;
            }
            catch (error) {
                console.error("Error deleting todo task:", error);
                return null;
            }
        });
    }
    updateTaskCompleation(userId, TaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const strikingTask = yield TodoSchema_1.Todo.findOneAndUpdate({ _id: TaskId, userId }, [{ $set: { completed: { $not: "$completed" } } }], { new: true });
                if (!strikingTask) {
                    return null;
                }
                return strikingTask;
            }
            catch (error) {
                console.error("Error striking todo task:", error);
                return null;
            }
        });
    }
    findOne(userId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTask = yield TodoSchema_1.Todo.findOne({ userId, task });
                return existingTask;
            }
            catch (error) {
                console.error("Error checking duplicate todo task:", error);
                return null;
            }
        });
    }
}
exports.UserRepository = UserRepository;
