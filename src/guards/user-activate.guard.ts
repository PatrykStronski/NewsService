import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { IPayload } from 'src/token/token.model';

@Injectable()
export class UserActivateGuard implements CanActivate {
    constructor(private tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.tokenService.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        const payload = await this.tokenService.verifyToken(token) as IPayload;
        request['user'] = payload;
        return true;
    }
}