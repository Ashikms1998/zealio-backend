"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ForgotpassSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verify_token: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15
    }
});
exports.ForgotSchema = mongoose_1.default.model("ForgotpassSchema", ForgotpassSchema);
