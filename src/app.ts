import dotenv from 'dotenv'
dotenv.config();
import http from 'http'
import passport from 'passport'
import './config/passportConfig';
import express from 'express';
const app = express();
app.use(express.json());
import mongoose from 'mongoose';
import { validateToken } from "../src/presentation/middleware/validateToken"
import { Server } from 'socket.io';
import cors from 'cors';
import AuthRoutes from "./presentation/router/AuthRoutes"
import MessageRoutes from "./presentation/router/MessageRoutes"
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

/*Socket io connecetion*/

const userSocketMap = new Map();

io.on('connection',(socket)=>{
    console.log('User connected:', socket.id);

    socket.on('user_connected',(userId)=>{
        userSocketMap.set(userId,socket.id)
    });

    socket.on('join chat',async(chatData)=>{
        try {
            const {chatId} = chatData;
            if(chatId){
                socket.join(`chat_${chatId}`);
            }else{
                console.log("Chat Id is missing");
            }
        } catch (error) {
            console.log("Error in join chat:",error);
        }
    })

    socket.on('chat message',async(messageData)=>{
        try {
            const {chatId,senderId,receiverId,image,audio,call,messageText,createdAt} = messageData;
            if(chatId && senderId && receiverId && createdAt || messageText || image || audio){
                const receiverSocketId = userSocketMap.get(receiverId);
                io.to(receiverSocketId).emit('chat message',{chatId, senderId, image, messageText, audio, call, createdAt})
            }else{
                console.error("Message data is incomplete");
            }
        } catch (error) {
            console.error("Error in chat message:", error);
        }
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected");
    });
});

mongoose.connect(process.env.MONGODB_STRING as string)
.then(()=>{
    console.info('connected to mongo');
})
.catch((err)=>{
    console.log(err);
})

app.use(cookieParser());
app.use(
    cors({
        origin:process.env.CLIENT_URL,
        credentials:true,
        exposedHeaders:["set-cookie"],
    })
);
app.use(express.static("src/public"));
app.use("/auth",AuthRoutes);
app.use("/chat",MessageRoutes)
app.use(passport.initialize());
app.get("/api/home",(req,res)=>{
    console.log("hello")
    res.json({message:"Hello World!"});
});

app.listen(PORT,()=>{
    console.log(`Server connected on port ${PORT}`)
}) 