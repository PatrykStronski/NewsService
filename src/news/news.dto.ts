import { NewsStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";

export class NewsInputDto {
    @IsString()
    title: string;

    @IsString()
    cover: string;

    @IsString()
    description: string;

    @IsEnum(NewsStatus)
    status: NewsStatus;
}

export class NewsModificationDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    cover: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(NewsStatus)
    @IsOptional()
    status: NewsStatus;
}

export class NewsPagination {
    @IsPositive()
    @IsOptional()
    page: number;

    @IsPositive()
    @IsOptional()
    take: number;
}