import { ObjectId, Types } from "mongoose";
import { User } from "../entities/User";

export interface ITodo{
    task:string;
    completed:boolean;
    userId:(Types.ObjectId | User)
}