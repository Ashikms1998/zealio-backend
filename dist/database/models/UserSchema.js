"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    verify_token: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
    googleId: { type: String, required: false },
    isBlocked: { type: Boolean, required: false, default: false }
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", UserSchema);
