export interface IToken{
    generatingTokens(userId:string):{
        accessToken:string;
        refreshToken:string;
    };
}