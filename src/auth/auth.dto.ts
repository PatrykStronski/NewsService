import { IsEmail, IsNumber, IsString } from "class-validator";

export class AuthBodyDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class TokenBodyDto {
    @IsEmail()
    email: string;
    
    @IsString()
    refresh: string;

    @IsNumber()
    code: number;

    @IsString()
    password: string;
}