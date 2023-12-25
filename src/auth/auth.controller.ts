import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { IToken } from 'src/token/token.model'
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { AuthBodyDto, RefreshBodyDto, TokenBodyDto } from './auth.dto';
import { CodesService } from 'src/codes/codes.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private tokenService: TokenService, private codesService: CodesService) {}

    @Post('auth')
    async auth(@Body() body: AuthBodyDto) {
        const user = await this.userService.authorizeUser(body);
        const code = await this.codesService.getCodeForUser(user.id);
        console.log({code, user: body.email});
    }

    @Post('token')
    async token(@Body() body: TokenBodyDto): Promise<IToken> {
        const payload = await this.userService.authorizeUser(body);
        await this.codesService.popCode(body.email, body.code);
        return this.tokenService.createTokens(payload)
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshBodyDto): Promise<IToken> {
        return this.tokenService.refreshToken(body.refresh, body.email)
    }
}
