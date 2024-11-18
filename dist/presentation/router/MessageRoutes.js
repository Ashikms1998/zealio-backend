"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const MessageController_1 = require("../controllers/MessageController");
const MessageService_1 = require("../../services/MessageService");
const MessageRepository_1 = require("../../database/repository/MessageRepository");
const repository = new MessageRepository_1.MessageRepository();
const service = new MessageService_1.MessageService(repository);
const controller = new MessageController_1.MessageController(service);
router.post("/userLog", controller.userList.bind(controller));
router.get("/:id", controller.getMessages.bind(controller));
router.post("/send/:id", controller.sendMessage.bind(controller));
exports.default = router;
