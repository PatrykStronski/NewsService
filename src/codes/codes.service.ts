import { Injectable } from '@nestjs/common';

@Injectable()
export class CodesService {
    generateCode() {
        return Math.floor(Math.random() * 1000000);
    }
}
