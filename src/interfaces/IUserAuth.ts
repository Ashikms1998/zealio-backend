import { Admin } from "../entities/Admin";
import { User } from "../entities/User";
import { ITodo } from "./ITodo";
import { IToken } from "./IToken";

export interface IUserAuth {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(userId:string):Promise<User|null>
  registerUser(data: Partial<User>, type?: string): Promise<User>;
  verifyUser(email: string, token: string): Promise<User | null>;
  loginUser(email: string, password: string): Promise<User | null>;
  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
  // resetPassword(email:string):Promise<User | null>
  otpUpdate(email: string, verify_token: string): Promise<User | null>;
  checkingOtp(email: string, verify_token: string): Promise<boolean>;
  changePassword(email: string, password: string): Promise<User | null>;
  adminLogin(email: string, password: string): Promise<Admin | null>;
  allUsers(): Promise<User[] | null>;
  searchedUsers(searchTerm?: string): Promise<User[] | null>
  checkBlocked(userId:string,isBlocked:boolean): Promise<User | null>
  todoUpdate(userId:string,task:string):Promise<ITodo | null>
  todoList(userId:string):Promise<ITodo[]|null>
  deletingTask(TaskId:string,userId:string):Promise<ITodo | null>
  strikeTask(TaskId:string,userId:string):Promise<ITodo | null>
}
