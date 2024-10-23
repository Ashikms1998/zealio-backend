import {  Message ,Conversation} from "../entities/Message";
import { User } from "../entities/User";

export interface IMessageRepository{
     findUsers(userId:string): Promise<User[] | null>
     sendMessage(Id:string,message:string,senderId:string):Promise<Message|null >
     gettingMessages(userToChatId:string,userId:string):Promise<Conversation|null >
}