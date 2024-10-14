import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
    @ApiProperty({
        description: 'Description of the image',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Folder where the image will be uploaded',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    folder: string;
}
