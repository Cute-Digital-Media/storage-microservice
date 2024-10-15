import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    login(): string {
        try {
            
        } catch (error) {
            
        }
        return this.authService.generateToken();
    }
}
