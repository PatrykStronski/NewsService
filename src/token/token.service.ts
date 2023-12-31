import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IPayload, IToken, TokenType } from './token.model';

@Injectable()
export class TokenService {
    private privateKey = readFileSync('src/keys/key.pem', 'utf8');
    private publicKey = readFileSync('src/keys/public.pem', 'utf8');

    createTokens(payload: IPayload): IToken {
        try {
            const token = jwt.sign({ ...payload, type: TokenType.standard }, this.privateKey, { algorithm: 'RS256', expiresIn: '1h' });
            const refresh = jwt.sign({ ...payload, type: TokenType.refresh }, this.privateKey, { algorithm: 'RS256', expiresIn: '1d' });
            return { token, refresh };
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException({ message: 'Could not authorize the user' })
        }
    }

    refreshToken(refresh: string, email: string): IToken {
        let payload;
        try {
            payload = jwt.verify(refresh, this.privateKey) as IPayload;
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException({ message: 'Unable to verify refresh token' })
        }
        if (payload.email !== email) {
            throw new UnauthorizedException({ message: 'Email in payload and body not matching' });
        }
        try {
            const token = jwt.sign({ email: payload.email, name: payload.name, role: payload.role, id: payload.id }, this.privateKey, { algorithm: 'RS256', expiresIn: '1h' });
            return {
                token
            }
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException({ message: 'Invalid refresh token' })
        }
    }

    verifyToken(token: string) {
        let payload;
        try {
            payload = jwt.verify(token, this.publicKey) as IPayload;
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException('cannot authorize jwt');
        }
        if (payload.type === TokenType.refresh) {
            throw new UnauthorizedException('cannot authorize with refresh token');
        }
        return payload;
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    extractUserIdFromToken(token: string): number {
        try {
            const payload: IPayload = jwt.decode(token);
            return payload.id
        } catch (e) {
            console.error(e)
            throw new BadRequestException('Invalid token');
        }
    }
}