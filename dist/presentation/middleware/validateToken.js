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
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Token_1 = require("../../external-libraries/Token");
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let JWT_KEY = process.env.JWT_SECRET;
        let AuthService = new Token_1.Token();
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        if (accessToken) {
            jsonwebtoken_1.default.verify(accessToken, JWT_KEY, (err, data) => {
                if (err) {
                    return res.status(403).json({
                        message: "access to the requested resource is forbidden.",
                    });
                }
                else {
                    req.userId = data.userId;
                    return next();
                }
            });
        }
        else {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res
                    .status(401)
                    .json({ message: "Refresh token not found, please log in again" });
            }
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: "Invalid refresh token, please log in again" });
                }
                const { accessToken } = AuthService.generatingTokens(data.userId);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 1000,
                });
                res.setHeader("Authorization", `Bearer ${accessToken}`);
                req.userId = data.userId;
                return next();
            }));
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateToken = validateToken;
