import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
    @IsNotEmpty()
    @IsString()
    tenant: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsString()
    folder: string;
}