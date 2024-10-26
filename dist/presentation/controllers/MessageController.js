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
exports.MessageController = void 0;
const app_1 = require("../../app");
class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    // async messageSend(req: Request, res: Response, next: NextFunction) {
    //     try {
    //        const {message} = req.body;
    //        const {id:receiverId} = req.params;
    //        const {userId:senderId} = req;
    //        const response = await this.messageService.sendingMessage(message,receiverId,senderId)
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //         res.status(500).json({ message: 'Failed to send message' });
    //     }
    // }
    userList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                console.log(userId, "UserId from forntend");
                const response = yield this.messageService.allUsers(userId);
                if (response && response.length === 0) {
                    return res.status(404).json({ message: "No users found" });
                }
                res
                    .status(200)
                    .json({ message: "Users retrieved successfully", data: response });
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                    message: "An error occurred while retrieving users",
                    errorDetails: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Id = req.params.id;
                const senderId = req.body.userId;
                const message = req.body.message;
                const response = yield this.messageService.sendedMessage(Id, senderId, message);
                const receiverSocketId = (0, app_1.getReceiverSocketId)(Id);
                req.io.to(receiverSocketId).emit("newMessage", response);
                if (response) {
                    return res
                        .status(200)
                        .json({ message: "conversation added successfully", response });
                }
                return res.status(400).json({
                    status: "error",
                    message: "Failed to send message",
                });
            }
            catch (error) {
                console.log("Error in sendMessage Controller:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userToChatId = req.params.id;
                const userId = req.query.userId;
                if (!userToChatId || !userId) {
                    return res.status(400).json({ error: "Missing required parameters" });
                }
                const response = yield this.messageService.getMessages(userToChatId, userId);
                if (!response) {
                    return res.status(404).json({ error: "Conversation not found" });
                }
                console.log(response, "This is the result of passing things");
                return res.status(200).json(response);
            }
            catch (error) {
                console.log("Error in getMessage Controller:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.MessageController = MessageController;
