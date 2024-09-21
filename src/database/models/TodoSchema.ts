import mongoose, { model, Schema } from "mongoose";

const todoSchema = new Schema({
    task:{type:String,required:true},
    completed:{type:Boolean,default:false},
    userId:{type: Schema.Types.ObjectId,ref:'User',required:true}
}, { timestamps: true })

export const Todo = model('Todo', todoSchema);