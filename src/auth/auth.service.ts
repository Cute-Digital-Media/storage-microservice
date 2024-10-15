import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    generateToken() {
        const payload = {
            userId: '1',
            role: 'admin',
            tenant: '1',
        };
        return this.jwtService.sign(payload, { expiresIn: '1h', secret: 'secret' });
    }
}