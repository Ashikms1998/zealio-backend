export interface User {
    id:string;
    firstName: string;
    lastName?: string;
    email: string;
    password?: string;
    verify_token?: string; 
    verified:boolean;
    googleId?:string;
    isBlocked?:boolean;
}