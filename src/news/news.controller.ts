import { Body, Controller, ExecutionContext, Get, Param, Patch, Put, UseGuards, createParamDecorator } from '@nestjs/common';
import { NewsService } from './news.service';
import { ModeratorActivateGuard } from 'src/guards/moderator-activate-guard';
import { NewsInputDto, NewsModificationDto, NewsPagination } from './news.dto';
import { UserActivateGuard } from 'src/guards/user-activate.guard';

export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user.userId;
    },
);

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    @Put()
    @UseGuards(ModeratorActivateGuard)
    async addNews(@Body() news: NewsInputDto, @UserId() userId: number){
       return this.newsService.createNews(news, userId);
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
}
