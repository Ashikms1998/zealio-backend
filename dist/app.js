"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("./presentation/router/AuthRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
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
app.get("/api/home", (req, res) => {
    console.log("hello");
    res.json({ message: "Hello World!" });
});
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
});
