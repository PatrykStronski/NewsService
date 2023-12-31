import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationInput, UserInput, UserRoleEdit, UserStatusEdit } from './user.dto';
import { AdminActivateGuard } from 'src/guards/admin-activate.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * 
     * @param body описывает пользователя который будет создан
     * @returns возвращает созданного пользователя
     * @description регистрирует пользователей админом
     */
    @Put()
    @HttpCode(202)
    @UseGuards(AdminActivateGuard)
    async newUser(@Body() body: UserInput){
        const createdUser = await this.userService.createUser(body);
        delete createdUser.password;
        delete createdUser.salt;
        return createdUser;
    }

    /**
     * 
     * @param param айдишник пользователя которого хочется найти
     * @returns возвращает объект с пользователем 
     */
    @Get(':userId')
    @UseGuards(AdminActivateGuard)
    async getUser(@Param() param: { userId: string}){ 
        const user = await this.userService.user(parseInt(param.userId));
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user;
    }
    
    /**
     * 
     * @param pagination описывает курсорную пагинацию 
     * @returns возвращает массив пользователей
     */
    @Get('')
    @UseGuards(AdminActivateGuard)
    async getAllUsers(@Query() pagination: PaginationInput){
       return await this.userService.users(parseInt(pagination.cursor) || undefined, parseInt(pagination.take) || undefined); 
    }

    /**
     * 
     * @param roleData в формате { role, email}, содерживает информацию по поводу новой роли для пользователя 
     * @returns возвращает объект с пользователем с новой ролью 
     */
    @Patch('editRole')
    @UseGuards(AdminActivateGuard)
    async editRole(@Body() roleData: UserRoleEdit){
        return await this.userService.changeUserRole(roleData);
    }

    /**
     * 
     * @param roleData в формате { role, email}, содерживает информацию по поводу нового статуса для пользователя 
     * @returns возвращает объект с пользователем с новым статусом 
     */
    @Patch('userStatus')
    @UseGuards(AdminActivateGuard)
    async editStatus(@Body() statusData: UserStatusEdit) {
        return await this.userService.changeUserStatus(statusData);
    }

    /**
     * 
     * @param param айдишник пользователя которого хочется удалить
     * @returns возвращает объект с пользователем которого удалили
     */
    @Delete(':userId')
    @UseGuards(AdminActivateGuard)
    async delete(@Param() param: { userId: string}){
        return await this.userService.deleteUser(parseInt(param.userId));
    }
}