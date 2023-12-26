import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UserRole } from '@prisma/client';
import { IPayload } from 'src/token/token.model';

/**
 * @description Проверяет является ли пользователь запрашивающий доступ к ресурсу администратором или модератором
 */
@Injectable()
export class ModeratorActivateGuard implements CanActivate {
    constructor(private tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.tokenService.extractTokenFromHeader(request);
        if (!token) {
            throw new BadRequestException('No Token Given');
        }
        const payload = await this.tokenService.verifyToken(token) as IPayload;
        if (payload.role === UserRole.user) throw new UnauthorizedException('User Does not have enough rights');
        request['user'] = payload;
        return true;
    }
}