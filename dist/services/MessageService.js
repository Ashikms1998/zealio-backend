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
exports.MessageService = void 0;
class MessageService {
    constructor(repository) {
        this.repository = repository;
    }
    // async sendingMessage(message: string, receiverId: string, senderId: string){
    // }
    allUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.repository.findUsers(userId);
            return users;
        });
    }
    sendedMessage(Id, message, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.repository.sendMessage(Id, message, senderId);
                return response;
            }
            catch (error) {
                console.error("Error in message service:", error);
                throw error;
            }
        });
    }
    getMessages(userToChatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.repository.gettingMessages(userToChatId, userId);
                return response;
            }
            catch (error) {
                console.error("Error in getting messages:", error);
                throw error;
            }
        });
    }
}
exports.MessageService = MessageService;
