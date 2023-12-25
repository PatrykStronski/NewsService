import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { PrismaService } from 'src/prisma.service';

const MAX_OTPS_PER_USER = 5;
const CODE_VALIDITY_SECONDS = 120;

@Injectable()
export class CodesService {
    constructor(private prisma: PrismaService) { }
    generateCode(): number {
        return Math.floor(Math.random() * 1000000);
    }

    async getCodeForUser(userId: number): Promise<number> {
        const code = this.generateCode();
        const codes = await this.prisma.otp.findMany({ where: { userId, expiresAt: {
            gte: moment().toDate(), 
            lte: moment().add(CODE_VALIDITY_SECONDS, 'seconds').toDate() 
        } } });
        if (codes.length > MAX_OTPS_PER_USER) {
            throw new ForbiddenException('Too many codes queries, try again later');
        }
        await this.prisma.otp.create({
            data: {
                userId,
                code,
                expiresAt: moment().add(CODE_VALIDITY_SECONDS, 'seconds').toDate()
            }
        })
        return code;
    }

    async popCode(email: string, code: number) {
        const entry = await this.prisma.otp.findFirst({where: {
            user: { email },
            code
        }});
        if (entry) {
            await this.prisma.otp.delete({ where: {id: entry.id}});
        }
        if(!entry) throw new UnauthorizedException('Code wrong');
    }

    @Cron('*/5 * * * *')
    async cleanOldCodes() {
        await this.prisma.otp.deleteMany({ where: { expiresAt: { lte: moment().toDate() } } });
    }
}
