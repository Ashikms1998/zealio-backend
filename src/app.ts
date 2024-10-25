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


app.use((req, res, next) => {
    req.io = io;
    next();
});

const userSocketMap:Record<string,string> = {}
export const getReceiverSocketId = (receiverId:string)=>{
    return userSocketMap[receiverId];
}


io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id);

    socket.on("disconnect",()=>{
        console.log("user disconnected", socket.id);
    });

    const userId = socket.handshake.query.userId

    if (userId != "undefined") userSocketMap[userId as string] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
        delete userSocketMap.userId;
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

    })

})



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

server.listen(PORT,()=>{
    console.log(`Server connected on port ${PORT}`)
}) 