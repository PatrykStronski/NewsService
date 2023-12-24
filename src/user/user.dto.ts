import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class UserInput {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: String

    @IsString()
    password: String

    @IsString()
    role: string;
}