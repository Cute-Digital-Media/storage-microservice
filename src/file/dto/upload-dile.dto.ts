import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'The files to upload',
    })
    files: Express.Multer.File[];
}
