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
    constructor(repository, bcrypt, mailer) {
        this.repository = repository;
        this.bcrypt = bcrypt;
        this.mailer = mailer;
    }
    findUserByEmail(email) {
        const user = this.repository.findByEmail(email);
        return user;
    }
    registerUser(input, type) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const html = (0, emailTemplate_1.default)(data.firstName, data.lastName, email, token);
                this.mailer.SendEmail(email, html);
                console.log(email, html, data.firstName, data.lastName, token, 'This is what sended');
                return data;
            }
        });
    }
    verifyUser(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByEmail(email);
            if (user) {
                if (user.verify_token === token) {
                    const data = {
                        verified: true
                    };
                    const update = yield this.repository.update(user.id, data);
                    if (update) {
                        return update;
                    }
                }
            }
            return null;
        });
    }
}
exports.authService = authService;
