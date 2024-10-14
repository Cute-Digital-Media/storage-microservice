import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({
        description: 'El correo electrónico del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'La contraseña del usuario',
        example: 'contraseña123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
