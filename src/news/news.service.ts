import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { NewsInputDto, NewsModificationDto, NewsPagination } from "./news.dto";

const MAX_TAKE = 100;

@Injectable()
export class NewsService {
    constructor(private prisma: PrismaService) {}

    async getNews(pagination: NewsPagination){
        let { page = 0, take = MAX_TAKE} = pagination;
        if (take > MAX_TAKE) take = MAX_TAKE
        return await this.prisma.news.findMany({
            skip: page * MAX_TAKE,
            take
        });
    }

    async getNewsById(id: number) {
        return await this.prisma.news.findUnique({ where: { id }});
    }

    async createNews(data: NewsInputDto, authorId: number) {
        try {
           return await this.prisma.news.create({
             data: {
                ...data,
                authorId
             }
           }) 
        } catch(e) {
            console.error({e});
            throw e;
        }
    }

    async deleteNews(id: number) {
        return await this.prisma.news.delete({ where: { id }});
    }

    async modifyNews(id: number, data: NewsModificationDto) {
        try{
            const modified = await this.prisma.news.update({ where: { id }, data}) 
        } catch(e) {
            console.error({e})
            throw e;
        }
    }
}