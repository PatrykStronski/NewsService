import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { NewsController } from './news/news.controller';
import { TokenService } from './token/token.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { CodesService } from './codes/codes.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, UserController, NewsController],
  providers: [AppService, TokenService, PrismaService, UserService, CodesService],
})
export class AppModule {}
