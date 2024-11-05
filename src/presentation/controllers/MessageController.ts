import { Request, Response, NextFunction } from "express";
import { IMessage } from "../../interfaces/IMessage";
import { getReceiverSocketId } from "../../app";

export class MessageController {
  private messageService: IMessage;

  constructor(messageService: IMessage) {
    this.messageService = messageService;
  }


  async userList(req: Request, res: Response, next: NextFunction) {
    try {

      const userId = req.body.userId as string;
      
      console.log(userId,"UserId from forntend")
      const response = await this.messageService.allUsers(userId);
      if (response && response.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res
        .status(200)
        .json({ message: "Users retrieved successfully", data: response });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "An error occurred while retrieving users",
          errorDetails: error instanceof Error ? error.message : String(error),
        });
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const Id = req.params.id;
      const senderId = req.body.userId;
      const message = req.body.message;
      
      const response = await this.messageService.sendedMessage(
        Id,
        senderId,
        message
      );
      const receiverSocketId =  getReceiverSocketId(Id)
      req.io.to(receiverSocketId).emit("newMessage",response)


      if (response) {
        return res
          .status(200)
          .json({ message: "conversation added successfully", response });
      }
      return res.status(400).json({
        status: "error",
        message: "Failed to send message",
      });
    } catch (error: any) {
      console.log("Error in sendMessage Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userToChatId = req.params.id;
      const userId = req.query.userId as string;
      if (!userToChatId || !userId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      const response = await this.messageService.getMessages(
        userToChatId,
        userId
      );
      if (!response) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      return res.status(200).json(response);
    } catch (error) {
      console.log("Error in getMessage Controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
