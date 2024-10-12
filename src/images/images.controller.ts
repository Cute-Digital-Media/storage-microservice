/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Param,
    BadRequestException,
    Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';
import { ImagesService } from './services/images.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';


@ApiTags('images') 
@Controller('images')
export class ImageController {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly imageService: ImagesService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload an image' }) // Resumen de la operación
    @ApiConsumes('multipart/form-data') // Indica que se consume 'multipart/form-data'
    @ApiBody({
        description: 'Image file to upload',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                uploadedBy: {
                    type: 'string',
                    example: 'usuario_simulado',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'The image has been successfully uploaded.' })
    @ApiResponse({ status: 400, description: 'No file provided or file size exceeds limit.' })
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body('uploadedBy') uploadedBy: string = 'usuario_simulado'
    ) {
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }

        // Validar el tamaño del archivo (máximo 5 MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new BadRequestException('El archivo es demasiado grande (máximo 5 MB)');
        }

        const url = await this.firebaseService.uploadImage(file);
        const image = await this.imageService.saveImage(
            file.originalname,
            url,
            file.size,
            uploadedBy
        );

        return { image };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an image by ID' }) // Resumen de la operación
    @ApiParam({ name: 'id', type: Number, description: 'ID of the image' }) // Parámetro ID
    @ApiResponse({ status: 200, description: 'Image retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Image not found.' })
    async getImage(@Param('id') id: number) {
        return this.imageService.getImage(id);
    }

}
