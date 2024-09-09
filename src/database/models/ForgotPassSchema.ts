import mongoose from "mongoose";

const ForgotpassSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    verify_token:{type:String , required:true},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 15
      }
});

export const ForgotSchema = mongoose.model("ForgotpassSchema",ForgotpassSchema)