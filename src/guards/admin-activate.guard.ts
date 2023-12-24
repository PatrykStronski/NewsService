import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UserRole } from '@prisma/client';
import { IPayload } from 'src/token/token.model';

@Injectable()
export class AdminActivateGuard implements CanActivate {
    constructor(private tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.tokenService.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        const payload = await this.tokenService.verifyToken(token) as IPayload;
        if (payload.role !== UserRole.admin) return false;
        request['user'] = payload;
        return true;
    }
}