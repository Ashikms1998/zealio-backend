
import { Conversation,Message } from "../entities/Message";
import { User } from "../entities/User";
import { IMessage } from "../interfaces/IMessage";
import { IMessageRepository } from "../interfaces/IMessageRepository";

export class MessageService implements IMessage{
    private repository: IMessageRepository;

    constructor(
        repository:IMessageRepository,
        
    ){
        this.repository = repository;
    }

    // async sendingMessage(message: string, receiverId: string, senderId: string){
        
    // }

    async allUsers(userId:string): Promise<User[] | null> {
        const users = await this.repository.findUsers(userId);
        return users
    }

    async sendedMessage(Id:string,message:string,senderId:string):Promise<Message| null>{
        try{        
        const response = await this.repository.sendMessage(Id,message,senderId)
        return response
        }catch(error){
            console.error("Error in message service:", error);
            throw error;  
        }
    }

    async getMessages(userToChatId:string,userId:string):Promise<Conversation| null>{
        try {
            const response = await this.repository.gettingMessages(userToChatId,userId)
            return response
        } catch (error) {
            console.error("Error in getting messages:", error);
            throw error; 
        }
    }

}