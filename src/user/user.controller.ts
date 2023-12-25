import { Body, Controller, Delete, ExecutionContext, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, UseGuards, createParamDecorator } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationInput, UserInput, UserRoleEdit } from './user.dto';
import { AdminActivateGuard } from 'src/guards/admin-activate.guard';
import { UserActivateGuard } from 'src/guards/user-activate.guard';
import { NotFoundError } from 'rxjs';

export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user.userId;
    },
);

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * 
     * @param body describes what user needs to be created
     * @returns user created adn 202 code
     * @description provides probability for the user to register
     */
    @Put()
    @HttpCode(202)
    async newUser(@Body() body: UserInput){
        const createdUser = await this.userService.createUser(body);
        delete createdUser.password;
        delete createdUser.salt;
        return createdUser;
    }

    @Get('/user/:userId')
    @UseGuards(AdminActivateGuard)
    async getUser(@Param() param: { userId: string}){ 
        const user = await this.userService.user(parseInt(param.userId));
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }
    
    @Get('users')
    @UseGuards(AdminActivateGuard)
    async getAllUsers(@Body() pagination: PaginationInput){
       return await this.userService.users(pagination.cursor, pagination.take); 
    }

    @Patch('editRole')
    @UseGuards(AdminActivateGuard)
    async editRole(@Body() roleData: UserRoleEdit){
        return await this.userService.changeUserRole(roleData);
    }

    @Delete(':userId')
    @UseGuards(AdminActivateGuard)
    async delete(@Param() param: { userId: string}){
        const user = await this.userService.deleteUser(parseInt(param.userId));
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }
}