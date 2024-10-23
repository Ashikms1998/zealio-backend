import mongoose from "mongoose";


const MessageSchema  = new mongoose.Schema({
   senderId:{
    type: String,
    ref:"User",
    required:true
   },
   receiverId:{
    type:String,
    ref:"User",
    required:true
   },
   message:{
    type:String,
    required:true
   }
},{timestamps:true})

export const Message = mongoose.model("Message",MessageSchema)