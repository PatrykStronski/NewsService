import { UserRole, UserStatus } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsPositive, IsString } from "class-validator";

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

export class UserStatusEdit {
    @IsEmail()
    email: string;

    @IsEnum(UserStatus)
    status: UserStatus;
}

export class PaginationInput {
    @IsPositive()
    @IsOptional()
    cursor?: number;

    @IsPositive()
    @IsOptional()
    take?: number;
}