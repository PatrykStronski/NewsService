import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { ModeratorActivateGuard } from 'src/guards/moderator-activate-guard';
import { NewsInputDto, NewsModificationDto, NewsPagination } from './news.dto';
import { UserActivateGuard } from 'src/guards/user-activate.guard';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService, private tokenService: TokenService) {}

    @Put()
    @HttpCode(202)
    @UseGuards(ModeratorActivateGuard)
    async addNews(@Body() news: NewsInputDto, @Req() request: Request) {
        const token = this.tokenService.extractTokenFromHeader(request);
        const userId = this.tokenService.extractUserIdFromToken(token);
        return await this.newsService.createNews(news, userId);
    }

    @Get()
    @UseGuards(UserActivateGuard)
    async getAllNews(@Body() pagination: NewsPagination) {
        return this.newsService.getNews(pagination);
    }
    
    @Get(':newsId')
    @UseGuards(UserActivateGuard)
    async getNewsById(@Param() param: { newsId: string}) {
        return this.newsService.getNewsById(parseInt(param.newsId));
    }

    @Patch(':newsId')
    @UseGuards(ModeratorActivateGuard)
    async modifyPost(@Body() modification: NewsModificationDto, @Param() param: { newsId: string}) {
        return this.newsService.modifyNews(parseInt(param.newsId), modification);
    }

    @Delete(':newsId')
    @UseGuards(ModeratorActivateGuard)
    async deletePost(@Param() param: { newsId: string}) {
        return this.newsService.deleteNews(parseInt(param.newsId));
    }
}
