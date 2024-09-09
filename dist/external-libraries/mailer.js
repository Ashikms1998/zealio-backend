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
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class Mailer {
    SendEmail(to, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: "ashikms1998@gmail.com",
                    pass: "szpm pzah egss rmzo",
                },
            });
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    const info = yield transporter.sendMail({
                        from: '"Zealio.live 👻" <zealio.live@gmail.com>', // sender address
                        to: `${to}`, // list of receivers
                        subject: "Verification Mail from Zealio✔", // Subject line
                        text: "This is to verify your account,Enter below code to verify your mail", // plain text body
                        html: data,
                    });
                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
                });
            }
            main().catch(console.error);
            return true;
        });
    }
}
exports.Mailer = Mailer;
