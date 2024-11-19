import dotenv from "dotenv";
dotenv.config();
import http from "http";
import passport from "passport";
import "./config/passportConfig";
import express from "express";
const app = express();
app.use(express.json());
import mongoose from "mongoose";
import { validateToken } from "../src/presentation/middleware/validateToken";
import { Server } from "socket.io";
import cors from "cors";
import AuthRoutes from "./presentation/router/AuthRoutes";
import MessageRoutes from "./presentation/router/MessageRoutes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./presentation/middleware/errorHandling";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10):3001;

const server = http.createServer(app);

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    })
  );
  app.options('*', cors());


const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  },
});
 
const userIdSocketIdMap = new Map();

app.use((req, res, next) => {
  req.io = io;
  next();
});

const userSocketMap: Record<string, string> = {};
export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  const userId = socket.handshake.query.userId;

if (!userId || userId === "undefined") {
  return;
} 
  userIdSocketIdMap.set(userId, socket.id);
  console.log(userIdSocketIdMap,"😯😯");
  if (userId != "undefined") userSocketMap[userId as string] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap.userId;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


  socket.on("call", async (participants) => {
    console.log("call reached backend participants", participants);
    try {
      const { caller, receiver } = participants;
      console.log(participants, "this is participants");
      if (participants) {
        console.log('User ID Socket Map:', userIdSocketIdMap);
        const receiverSocketId = userIdSocketIdMap.get(receiver.id);
        console.log('Emitting incomingcall to', receiverSocketId);
        io.to(receiverSocketId).emit("incomingcall", { caller, receiver });
      } else {
        console.error("call data is incomplete");
      }
    } catch (error) {
      console.log("Error in calling:", error);
    }
  });


  socket.on('hangupDuringInitiation', async (ongoingCall) => {
    try {
      console.log('Hangup during initiation event received:', ongoingCall);
      const { participants } = ongoingCall;
  
      if (participants && participants.caller && participants.receiver) {
        const receiverSocketId = userIdSocketIdMap.get(participants.receiver.id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callCancelled', { 
            message: 'The caller has cancelled the call.' 
          });
        }
        
        const callerSocketId = userIdSocketIdMap.get(participants.caller.id);
        if (callerSocketId) {
          io.to(callerSocketId).emit('callCancelled', { 
            message: 'Call has been cancelled.' 
          });
        }
        
        console.log(`Call cancelled between ${participants.caller.id} and ${participants.receiver.id}`);
      } else {
        console.error("Hangup during initiation data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup during initiation event:", error);
    }
  });

  socket.on('webrtcSignal', async (data) => {
    if (data.isCaller) {
      if (data.ongoingCall.participants.receiver.id||data.ongoingCall.participants.receiver._id) {
        const emitSocketId = userIdSocketIdMap.get(data.ongoingCall.participants.receiver.id);
        io.to(emitSocketId).emit('webrtcSignal', data)
      }
    } else {
      if (data.ongoingCall.participants.caller.id||data.ongoingCall.participants.caller._id) {
        const emitSocketId = userIdSocketIdMap.get(data.ongoingCall.participants.caller.id);
        console.log('emitted to caller web',emitSocketId,"this is emitetr socket",userIdSocketIdMap,"this is whole package useridsocketid");

        io.to(emitSocketId).emit('webrtcSignal', data)
      }
    }
  });

  socket.on('hangup', async (ongoingCall) => {
    try {
      console.log('Hangup event received:', ongoingCall);
      const { participants } = ongoingCall;

      if (participants && participants.caller && participants.receiver) {
        const otherParticipantId = socket.id === userIdSocketIdMap.get(participants.caller.id)
          ? participants.receiver.id
          : participants.caller.id;

        const otherParticipantSocketId = userIdSocketIdMap.get(otherParticipantId);

        if (otherParticipantSocketId) {
          io.to(otherParticipantSocketId).emit('callEnded', { message: 'The other participant has ended the call.' });
        }
        console.log(`Call ended between ${participants.caller.id} and ${participants.receiver.id}`);
      } else {
        console.error("Hangup data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup event:", error);
    }
  });


});

mongoose
  .connect(process.env.MONGODB_STRING as string)
  .then(() => {
    console.info("connected to mongo");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.static("src/public"));
app.use("/auth", AuthRoutes);
app.use("/chat", MessageRoutes);
// app.use(errorHandler)
app.use(passport.initialize());
app.get("/api/home", (req, res) => {
  console.log("hello");
  res.json({ message: "Hello World!" });
});

server.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
