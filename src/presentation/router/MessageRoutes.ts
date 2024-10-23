import express from "express";
const router = express.Router();
import { MessageController } from "../controllers/MessageController";
import {MessageService} from "../../services/MessageService";
import {MessageRepository} from "../../database/repository/MessageRepository";
import { validateToken } from "../middleware/validateToken";
const repository = new MessageRepository();
const service = new MessageService(repository);
const controller = new MessageController(service)

// router.post("/send",validateToken,controller.messageSend.bind(controller))
router.post("/userLog",controller.userList.bind(controller));
router.get("/:id",controller.getMessages.bind(controller))
router.post("/send/:id",controller.sendMessage.bind(controller));
export default router