import { Conversation } from "../entities/Message";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

export interface IMessage{
    // sendingMessage(message:string,receiverId:string,senderId:string):Promise<Message>;
    allUsers(userId:string):Promise<User[] | null>
    sendedMessage(Id:string,message:string,senderId:string):Promise<Message | null >
    getMessages(userToChatId:string,userId:string):Promise<Conversation | null >
}