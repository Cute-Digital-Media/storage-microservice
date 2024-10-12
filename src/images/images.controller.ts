/* eslint-disable prettier/prettier */
import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Delete, NotFoundException, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';
import { ImagesService } from './services/images.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import logger from '../logger';
import { Image } from './entities/image.entity';
import { ImageTransformService } from './services/image-transform.service';



@ApiTags('images') 
@Controller('images')
export class ImageController {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly imageService: ImagesService,
        private readonly imageTransformService: ImageTransformService,
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
            logger.error('No se ha proporcionado ningún archivo');
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }

        // Validar el tamaño del archivo (máximo 5 MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            logger.warn('El archivo es demasiado grande (máximo 5 MB)');
            throw new BadRequestException('El archivo es demasiado grande (máximo 5 MB)');
        }

        const url = await this.firebaseService.uploadImage(file);
        const image = await this.imageService.saveImage(
            file.originalname,
            url,
            file.size,
            uploadedBy
        );
        logger.info(`Imagen subida: ${file.originalname}, URL: ${url}`);
        return { image };
    }

    // Endpoint para obtener todas las imágenes
    @Get()
    @ApiOperation({ summary: 'Get all images' }) // Resumen de la operación
    @ApiResponse({ status: 200, description: 'Images retrieved successfully.' }) // Respuesta exitosa
    async getAllImages(): Promise<Image[]> {
        return this.imageService.getAllImages();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an image by ID' }) // Resumen de la operación
    @ApiParam({ name: 'id', type: Number, description: 'ID of the image' }) // Parámetro ID
    @ApiResponse({ status: 200, description: 'Image retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Image not found.' })
    async getImage(@Param('id') id: number) {
        return this.imageService.getImage(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an image by ID' }) // Resumen de la operación
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'ID of the image to delete',
        example: 1,
    }) // Parámetro ID
    @ApiResponse({ status: 200, description: 'Image deleted successfully.' }) // Respuesta exitosa
    @ApiResponse({ status: 404, description: 'Image not found.' }) // Respuesta para imagen no encontrada
    @ApiResponse({ status: 400, description: 'Invalid ID or failed to delete the image.' }) // Respuesta para error
    async deleteImage(@Param('id') id: number) {
        const image = await this.imageService.getImage(id);
        if (!image) {
            logger.warn(`No se encontró la imagen con ID ${id}`);
            throw new NotFoundException(`No se encontró la imagen con ID ${id}`);
        }

        // Elimina la imagen de Firebase Storage.
        await this.firebaseService.deleteImage(image.url);

        // Elimina el registro de la base de datos.
        await this.imageService.deleteImage(id);
        logger.info(`Imagen con ID ${id} eliminada exitosamente`);
        return { message: `Imagen con ID ${id} eliminada exitosamente` };
    }


    @Post('resize')
    @UseInterceptors(FileInterceptor('file'))
    async resizeImage(
        @UploadedFile() file: Express.Multer.File,
        @Body('width') width: string,  // Cambiar a string para recibir correctamente el valor
        @Body('height') height: string, // Cambiar a string para recibir correctamente el valor
    ) {
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }

        // Convertir width y height a números
        const widthNumber = parseInt(width, 10);
        const heightNumber = parseInt(height, 10);

        // Validar que los parámetros sean números positivos
        if (isNaN(widthNumber) || isNaN(heightNumber) || widthNumber <= 0 || heightNumber <= 0) {
            throw new BadRequestException('Los parámetros de ancho y altura deben ser números positivos');
        }

        // Redimensionar la imagen
        const resizedImageBuffer = await this.imageTransformService.resizeImage(file.buffer, widthNumber, heightNumber);

        // Crear un objeto simulado de tipo Express.Multer.File
        const resizedFile: Express.Multer.File = {
            fieldname: file.fieldname,
            originalname: `resized_${file.originalname}`,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: resizedImageBuffer.length,
            buffer: resizedImageBuffer,
            stream: null,
            destination: '',
            filename: `resized_${file.originalname}`,
            path: '',
        };

        // Subir la imagen redimensionada a Firebase
        const url = await this.firebaseService.uploadImage(resizedFile);
        return { url };
    }


}
