import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { SignInDto } from "./dtos/signindto";
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth') // Etiqueta para agrupar en Swagger
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' }) // Descripción de la operación
    @ApiResponse({ status: 200, description: 'Login exitoso.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta. Verifica los datos enviados.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    public async signIng(@Body() signInDto: SignInDto, @Res() response: Response) {
        const token = await this.authService.signIng(signInDto);

        response.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        return response.send({ message: 'Login successful' });
    }

    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión' }) // Descripción de la operación
    @ApiResponse({ status: 200, description: 'Logout exitoso.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    logout(@Res() response: Response) {
        response.cookie('jwt', "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'lax',
        });
        return response.status(200).json({ message: 'Logout exitoso' });
    }
}
