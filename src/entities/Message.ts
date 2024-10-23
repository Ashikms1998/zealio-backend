import mongoose, { ObjectId, Types } from "mongoose";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
  
}

// export interface MessageDocument extends mongoose.Document {
//   senderId: Types.ObjectId;
//   receiverId: Types.ObjectId;
//   message: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}


// export interface ConversationDocument extends mongoose.Document {
//   _id: Types.ObjectId;
//   participants: Types.ObjectId[];
//   messages: Types.ObjectId[];
//   createdAt: Date;
//   updatedAt: Date;
// }