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
class authController {
    constructor(authService) {
        this.authService = authService;
    }
    userRegistration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body, "body");
                // const existingUser = await this.authService.findUserByEmail(body.email)
                // if (existingUser) {
                //     if (!existingUser.verified) {
                //       return res
                //         .status(409)
                //         .json({ error: "Verification Link Already Send" });
                //     }
                //     return res
                //       .status(409)
                //       .json({ error: "User Already exits with given email " });
                //   }
                const data = yield this.authService.registerUser(body);
                console.log(data, "data");
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
                let result;
                if (token && email) {
                    result = yield this.authService.verifyUser(email, token);
                    console.log("user verified", result);
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
}
exports.authController = authController;
