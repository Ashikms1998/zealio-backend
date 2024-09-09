import dotenv from 'dotenv'
dotenv.config();
import passport from 'passport'
import './config/passportConfig';
import express from 'express';
const app = express();
app.use(express.json());
import mongoose from 'mongoose';
import cors from 'cors';
import AuthRoutes from "./presentation/router/AuthRoutes"
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

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
app.use(passport.initialize());
app.get("/api/home",(req,res)=>{
    console.log("hello")
    res.json({message:"Hello World!"});
});

app.listen(PORT,()=>{
    console.log(`Server connected on port ${PORT}`)
})