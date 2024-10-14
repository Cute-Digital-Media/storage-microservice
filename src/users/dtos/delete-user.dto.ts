import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario que se desea eliminar',
        example: 'usuario@ejemplo.com',
        maxLength: 96
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(96)
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario para la autenticación',
        example: 'Contraseña@123',
        minLength: 8,
        maxLength: 96
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(96)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message:
            'Minimum eight characters, at least one letter, one number and one special character',
    })
    password: string;
}
