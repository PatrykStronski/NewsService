import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IToken } from 'src/token/token.model'
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { AuthBodyDto, TokenBodyDto } from './auth.dto';
import { CodesService } from 'src/codes/codes.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private tokenService: TokenService, private codesService: CodesService) {}

    @Post('auth')
    async auth(@Body() body: AuthBodyDto) {
        await this.userService.authorizeUser(body);
        return this.codesService.generateCode();
    }

    @Post('token')
    async token(@Body() body: TokenBodyDto): Promise<IToken> {
        const payload = await this.userService.getUserByMail(body.email);
        return this.tokenService.createTokens(payload)
    }
}
