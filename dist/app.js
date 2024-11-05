"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const passport_1 = __importDefault(require("passport"));
require("./config/passportConfig");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("./presentation/router/AuthRoutes"));
const MessageRoutes_1 = __importDefault(require("./presentation/router/MessageRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const userIdSocketIdMap = new Map();
app.use((req, res, next) => {
    req.io = io;
    next();
});
const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
    const userId = socket.handshake.query.userId;
    userIdSocketIdMap.set(userId, socket.id);
    if (userId != "undefined")
        userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap.userId;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
    socket.on("call", (participants) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("call reached backend participants", participants);
        try {
            const { caller, receiver } = participants;
            console.log(participants, "this is participants");
            if (participants) {
                console.log('User ID Socket Map:', userIdSocketIdMap);
                const receiverSocketId = userIdSocketIdMap.get(receiver.id);
                console.log('Emitting incomingcall to', receiverSocketId);
                io.to(receiverSocketId).emit("incomingcall", { caller, receiver });
            }
            else {
                console.error("call data is incomplete");
            }
        }
        catch (error) {
            console.log("Error in calling:", error);
        }
    }));
    socket.on('hangupDuringInitiation', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else {
                console.error("Hangup during initiation data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup during initiation event:", error);
        }
    }));
    socket.on('webrtcSignal', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, 'webrtcSignal data');
        if (data.isCaller) {
            if (data.ongoingCall.participants.receiver.id) {
                const emitSocketId = userIdSocketIdMap.get(data.ongoingCall.participants.receiver.id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
        else {
            if (data.ongoingCall.participants.caller._id) {
                const emitSocketId = userIdSocketIdMap.get(data.ongoingCall.participants.caller.id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
    }));
    socket.on('hangup', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else {
                console.error("Hangup data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup event:", error);
        }
    }));
    socket.on('sent connection request', (receiverId, userId, username) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('requested', receiverId, userId, username);
        try {
            if (receiverId) {
                const receiverSocketId = userIdSocketIdMap.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('connectionRequestReceived', userId, username);
                }
                else {
                    console.error("Receiver socket not found");
                }
            }
            else {
                console.error("Receiver Id is not available");
            }
        }
        catch (error) {
            console.error("Error in sent connection request:", error);
        }
    }));
    socket.on('accept connetion request', (receiverId, userId, username) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('requested', receiverId);
        try {
            if (receiverId) {
                const receiverSocketId = userIdSocketIdMap.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('connectionRequestAccepted', userId, username);
                }
                else {
                    console.error("Receiver socket not found");
                }
            }
            else {
                console.error("Receiver Id is not available");
            }
        }
        catch (error) {
            console.error("Error in accept connetion request:", error);
        }
    }));
});
mongoose_1.default
    .connect(process.env.MONGODB_STRING)
    .then(() => {
    console.info("connected to mongo");
})
    .catch((err) => {
    console.log(err);
});
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));
app.use(express_1.default.static("src/public"));
app.use("/auth", AuthRoutes_1.default);
app.use("/chat", MessageRoutes_1.default);
app.use(passport_1.default.initialize());
app.get("/api/home", (req, res) => {
    console.log("hello");
    res.json({ message: "Hello World!" });
});
server.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
});
