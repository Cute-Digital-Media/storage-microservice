import { ApiProperty } from '@nestjs/swagger';

export class UploadImageWithFileDto {
    @ApiProperty({
        description: 'Description of the image',
        type: String,
    })
    description: string;

    @ApiProperty({
        description: 'Folder where the image will be uploaded',
        type: String,
    })
    folder: string;

    @ApiProperty({
        description: 'File to be uploaded',
        type: 'string',
        format: 'binary', // Indica que este es un archivo binario
    })
    file: any; // Aquí puedes usar `any` o `Express.Multer.File` según tu preferencia
}