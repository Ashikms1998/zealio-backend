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
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserSchema_1.User.findOne({ email: email });
            if (user) {
                const userData = {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    verify_token: user.verify_token,
                    verified: user.verified,
                };
                return userData;
            }
            return null;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserData = yield UserSchema_1.User.create(data);
            const newUser = {
                id: newUserData._id.toString(),
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                password: newUserData.password,
                verify_token: newUserData.verify_token,
                verified: newUserData.verified
            };
            return newUser;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield UserSchema_1.User.findOneAndUpdate({ id: id }, { $set: data }, { new: true });
            if (updatedUser) {
                return {
                    id: updatedUser._id.toString(),
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    password: updatedUser.password,
                    verify_token: updatedUser.verify_token,
                    verified: updatedUser.verified,
                };
            }
            return null;
        });
    }
}
exports.UserRepository = UserRepository;
