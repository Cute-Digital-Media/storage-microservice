import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { OneToMany } from "typeorm";
import { ImageController } from "src/image/image.controller";

export class CreateUserDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com',
        maxLength: 96
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(96)
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
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

    @ApiProperty({
        description: 'Roles asignados al usuario',
        example: ['Admin', 'Importaciones'],
        isArray: true
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    rol: string[];

    @IsString()
    @IsNotEmpty()
    tenant: string;



}
