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

    /**
     * 
     * @param news содерживает в себе информацию про новость которая будет создана
     * @param request это объект запроса из которого выделяется АйДишник пользователя
     * @returns созданный объект
     */
    @Put()
    @HttpCode(202)
    @UseGuards(ModeratorActivateGuard)
    async addNews(@Body() news: NewsInputDto, @Req() request: Request) {
        const token = this.tokenService.extractTokenFromHeader(request);
        const userId = this.tokenService.extractUserIdFromToken(token);
        return await this.newsService.createNews(news, userId);
    }

    /**
     * 
     * @param pagination необязательный объект пагинации 
     * @returns массив пользователей
     */
    @Get()
    @UseGuards(UserActivateGuard)
    async getAllNews(@Body() pagination: NewsPagination) {
        return this.newsService.getNews(pagination);
    }
    
    /**
     * 
     * @param param параметр определяющий айдищник новости которую хочется получить
     * @returns новость по айдишнику
     */
    @Get(':newsId')
    @UseGuards(UserActivateGuard)
    async getNewsById(@Param() param: { newsId: string}) {
        return this.newsService.getNewsById(parseInt(param.newsId));
    }

    /**
     * 
     * @param param параметр определяющий айдищник новости которую хочется модифицировать
     * @param modification объект содержающий модификации для новости. Все его ключи необязательны
     * @returns модифицированную новость
     */
    @Patch(':newsId')
    @UseGuards(ModeratorActivateGuard)
    async modifyPost(@Body() modification: NewsModificationDto, @Param() param: { newsId: string}) {
        return this.newsService.modifyNews(parseInt(param.newsId), modification);
    }


    /**
     * 
     * @param param параметр определяющий айдищник новости которую хочется удалить
     * @returns новость которая была удаленной 
     */
    @Delete(':newsId')
    @UseGuards(ModeratorActivateGuard)
    async deletePost(@Param() param: { newsId: string}) {
        return this.newsService.deleteNews(parseInt(param.newsId));
    }
}
