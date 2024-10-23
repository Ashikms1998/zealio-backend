import mongoose, { Types } from "mongoose";
import {  Conversation, Message } from "../../entities/Message";
import { User } from "../../entities/User";
import { IMessageRepository } from "../../interfaces/IMessageRepository";
import { Conversation as ConversationModel } from "../models/ConversationSchema";
import { Message as MessageModel } from "../models/MessageSchema";
import { User as UserModel } from "../models/UserSchema";
import { json } from "stream/consumers";
import { convertToConversation } from "../../presentation/utils/converters";
import { response } from "express";
export class MessageRepository implements IMessageRepository {
  async findUsers(userId: string): Promise<User[] | null> {
    try {
      const documents = await UserModel.find();
     
      const users = documents
        .filter((doc) => doc._id.toString() !== userId)
        .map((doc) => {
          return {
            id: doc._id.toString(),
            firstName: doc.firstName,
            lastName: doc.lastName ?? "",
            email: doc.email,
            password: doc.password ?? "",
            verify_token: doc.verify_token ?? "",
            verified: doc.verified,
            isBlocked: doc.isBlocked ?? false,
          };
        });
        
        // console.log(users,"userid removed->",userId);

      return users.length > 0 ? users : null;
    } catch (error) {
      console.error("Error during finding all users:", error);
      return null;
    }
  }

  async sendMessage(senderId: string,Id: string,message: string): Promise<Message| null> {
    try {
      let conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, Id] },
      });
      if (!conversation) {
        conversation = await ConversationModel.create({
          participants: [senderId, Id],
          messages: [],
        });
      }
      const newMessage = new MessageModel({
        senderId: senderId,
        receiverId: Id,
        message: message,
      });
      // console.log(conversation,"conversation",newMessage,'new Message')
      conversation.messages.push(newMessage.id);
      
      await Promise.all([conversation.save(),newMessage.save()]);
      
      // const conversationObj = conversation.toObject() as {
      //   _id: Types.ObjectId;
      //   participants: Types.ObjectId[];
      //   messages: Types.ObjectId[];
      //   createdAt: Date;
      //   updatedAt: Date;
      // };
      // const result: Conversation = {
      //   id: conversationObj._id.toString(),
      //   participants: conversationObj.participants.map(id => id.toString()),
      //   messages: conversationObj.messages.map(id => id.toString()),
      //   createdAt: conversationObj.createdAt,
      //   updatedAt: conversationObj.updatedAt
      // };
      console.log(newMessage.toObject() as Message,"This is result of whole conversation")
      return newMessage.toObject() as Message;
      
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  async gettingMessages(userToChatId:string,userId:string): Promise<Conversation| null> {
    try {
      
      const conversation = await ConversationModel.findOne({
        participants:{$all:[userToChatId,userId]},
      }).populate("messages")
      console.log(conversation,'bro this is conversation');
      // console.log(conversation?conversation.toObject() as Conversation:'bro this is conversation');

      return conversation ? (conversation.toObject() as Conversation) : null;

    } catch (error) {
      console.error("Error getting messages:", error);
      return null;
    }
  }


}
