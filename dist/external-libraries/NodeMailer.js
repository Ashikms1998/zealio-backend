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
exports.SendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendMail {
    static sendmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendOtpEmail = (email, otp) => __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => {
                        const transporter = nodemailer_1.default.createTransport({
                            service: "gmail",
                            auth: {
                                user: "ashikms1998@gmail.com",
                                pass: "szpm pzah egss rmzo",
                            },
                        });
                        const mailOptions = {
                            from: '"Zealio" <ashikms1998@gmail.com>',
                            to: email,
                            subject: "Your OTP for Zelio Authentication",
                            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://res.cloudinary.com/dmycxwzis/image/upload/v1724682803/l50qjda9c7zgfqfeyu2l.png" alt="Zealio Logo" style="width: 150px;">
                </div>
                <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
                  <h1 style="font-size: 24px; color: #333333;">One-Time Password (OTP) for Authentication</h1>
                  <p style="font-size: 16px; color: #555555;">Dear User,</p>
                  <p style="font-size: 16px; color: #555555;">Your One-Time Password (OTP) for authentication is:</p>
                  <h2 style="font-size: 36px; color: #333333; text-align: center;">${otp}</h2>
                  <p style="font-size: 16px; color: #555555; margin-top: 20px;">Please use this OTP to complete your authentication process. This OTP is valid for the next 10 minutes.</p>
                  <p style="font-size: 16px; color: #555555;">If you did not request this OTP, please contact our support team immediately.</p>
                 
                </div>
                
              </div>
            `,
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(info.response);
                            }
                        });
                    });
                });
                const mailSent = yield sendOtpEmail(email, otp);
                return mailSent;
            }
            catch (error) {
                console.error("Error", error);
                throw error;
            }
        });
    }
}
exports.SendMail = SendMail;
