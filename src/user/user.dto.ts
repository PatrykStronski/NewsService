import { UserRole, UserStatus } from "@prisma/client";
import { IsEmail, IsEnum, IsPhoneNumber, IsPositive, IsString } from "class-validator";

export class UserInput {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone: string

    @IsString()
    password: string

    @IsEnum(UserRole)
    role: UserRole;

    status?: UserStatus;
    salt?: string;    
}

export class UserRoleEdit {
    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
}

export class PaginationInput {
    @IsPositive()
    cursor?: number;

    @IsPositive()
    take?: number;
}