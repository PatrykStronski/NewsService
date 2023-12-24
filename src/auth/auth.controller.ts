import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IToken } from 'src/token/token.model'
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { AuthBodyDto, TokenBodyDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private tokenService: TokenService) {}

    @Post('auth')
    async auth(@Body() body: AuthBodyDto) {
        return 'a';
    }

    @Post('token')
    async token(@Body() body: TokenBodyDto): Promise<IToken> {
        const payload = await this.userService.authorizeUser(body);
        return this.tokenService.createTokens(payload)
    }
}
