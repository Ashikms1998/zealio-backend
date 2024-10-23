import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:false},
    email:{type:String,required:true},
    password:{type:String,required:false},
    verify_token:{type:String , required:false},
    verified:{type:Boolean,required:true, default:false},
    googleId: { type: String, required: false },
    isBlocked:{type:Boolean,required:false,default:false}
    
},{timestamps:true});

export const User = mongoose.model("User",UserSchema)
