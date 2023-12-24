import { UserRole, UserStatus } from "@prisma/client";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class UserInput {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string

    @IsString()
    password: string

    @IsString()
    role: UserRole;

    @IsString()
    status: UserStatus;

    salt?: string;    
}