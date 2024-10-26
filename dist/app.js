"use strict";
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
        methods: ["GET", "POST"]
    }
});
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
    console.log("A user is connected", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
    const userId = socket.handshake.query.userId;
    if (userId != "undefined")
        userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap.userId;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
mongoose_1.default.connect(process.env.MONGODB_STRING)
    .then(() => {
    console.info('connected to mongo');
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
