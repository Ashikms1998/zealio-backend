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
exports.MessageRepository = void 0;
const ConversationSchema_1 = require("../models/ConversationSchema");
const MessageSchema_1 = require("../models/MessageSchema");
const UserSchema_1 = require("../models/UserSchema");
// import { getReceiverSocketId } from "../../app";
class MessageRepository {
    findUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield UserSchema_1.User.find();
                const users = documents
                    .filter((doc) => doc._id.toString() !== userId)
                    .map((doc) => {
                    var _a, _b, _c, _d;
                    return {
                        id: doc._id.toString(),
                        firstName: doc.firstName,
                        lastName: (_a = doc.lastName) !== null && _a !== void 0 ? _a : "",
                        email: doc.email,
                        password: (_b = doc.password) !== null && _b !== void 0 ? _b : "",
                        verify_token: (_c = doc.verify_token) !== null && _c !== void 0 ? _c : "",
                        verified: doc.verified,
                        isBlocked: (_d = doc.isBlocked) !== null && _d !== void 0 ? _d : false,
                    };
                });
                // console.log(users,"userid removed->",userId);
                return users.length > 0 ? users : null;
            }
            catch (error) {
                console.error("Error during finding all users:", error);
                return null;
            }
        });
    }
    sendMessage(senderId, Id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let conversation = yield ConversationSchema_1.Conversation.findOne({
                    participants: { $all: [senderId, Id] },
                });
                if (!conversation) {
                    conversation = yield ConversationSchema_1.Conversation.create({
                        participants: [senderId, Id],
                        messages: [],
                    });
                }
                const newMessage = new MessageSchema_1.Message({
                    senderId: senderId,
                    receiverId: Id,
                    message: message,
                });
                conversation.messages.push(newMessage.id);
                yield Promise.all([conversation.save(), newMessage.save()]);
                return newMessage.toObject();
            }
            catch (error) {
                console.error("Error sending message:", error);
                return null;
            }
        });
    }
    gettingMessages(userToChatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield ConversationSchema_1.Conversation.findOne({
                    participants: { $all: [userToChatId, userId] },
                }).populate("messages");
                return conversation ? conversation.toObject() : null;
            }
            catch (error) {
                console.error("Error getting messages:", error);
                return null;
            }
        });
    }
}
exports.MessageRepository = MessageRepository;
