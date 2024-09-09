import { Admin } from "../entities/Admin";
import { User } from "../entities/User";

export interface IUserRepository{
    findByEmail(email: string):Promise <User | null>
    create(data:User):Promise<User>;
    update(id:string,data:any):Promise<User| null>
    // changePassword(email:string,verify_token:string):Promise <User | null>
    otpupdate(email:string,verify_token:string):Promise<User| null>
    otpCheck(email:string,verify_token:string):Promise<User| null>
    changePasscode(id:string,hashedPassword:string):Promise<User| null>
    findAdminByEmail(email:string):Promise <Admin | null>
    findUsers(): Promise<User[] | null>
    createOrUpdateGoogleUser(profile:any):Promise<any>;
    searchedUsers(searchTerm?:string): Promise<User[] | null>
    isBlocked(userId:string,isBlocked:boolean):Promise<User| null>
}