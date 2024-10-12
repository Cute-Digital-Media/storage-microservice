/* eslint-disable prettier/prettier */
import { Controller, UseGuards, Post, UploadedFile, UseInterceptors, Get, Param, Delete, NotFoundException, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';
import { ImagesService } from './services/images.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import logger from '../logger';
import { Image } from './entities/image.entity';
import { ImageTransformService } from './services/image-transform.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)// Use JWT authentication guard for the routes
@ApiTags('images') // Tag for the images API
@Controller('images')// Define the controller for image-related routes
export class ImageController {
    constructor(
        private readonly firebaseService: FirebaseService, // Firebase service for handling image uploads
        private readonly imageService: ImagesService, // Service for image-related database operations
        private readonly imageTransformService: ImageTransformService, // Service for transforming images
    ) { }


    @Post('upload') // Endpoint to upload images
    @UseInterceptors(FileInterceptor('file')) // Use file interceptor to handle file uploads
    @ApiOperation({ summary: 'Upload an image' }) // Summary of the operation
    @ApiConsumes('multipart/form-data') // Indicates that 'multipart/form-data' is consumed
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
        @UploadedFile() file: Express.Multer.File, // The uploaded file
        @Body('uploadedBy') uploadedBy: string = 'usuario_simulado' // The user who uploaded the file
    ) {
        if (!file) {
            logger.error('No se ha proporcionado ningún archivo');
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }

        // Validate file size (maximum 5 MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            logger.warn('File is too large (max 5 MB)'); // Log warning if file is too large
            throw new BadRequestException('File is too large (max 5 MB)'); // Throw error
        }

        const url = await this.firebaseService.uploadImage(file); // Upload image to Firebase
        const image = await this.imageService.saveImage( // Save image information in the database
            file.originalname,
            url,
            file.size,
            uploadedBy
        );
        logger.info(`Imagen subida: ${file.originalname}, URL: ${url}`);
        return { image };
    }

    // Endpoint to get all images
    @Get()
    @ApiOperation({ summary: 'Get all images' }) // Summary of the operation
    @ApiResponse({ status: 200, description: 'Images retrieved successfully.' }) // Successful response
    async getAllImages(): Promise<Image[]> {
        return this.imageService.getAllImages();
    }

    @Get(':id')// Endpoint to get an image by its ID
    @ApiOperation({ summary: 'Get an image by ID' }) // Summary of the operation
    @ApiParam({ name: 'id', type: Number, description: 'ID of the image' }) // Parámetro ID
    @ApiResponse({ status: 200, description: 'Image retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Image not found.' })
    async getImage(@Param('id') id: number) {
        return this.imageService.getImage(id);// Return image by ID
    }

    @Delete(':id')// Endpoint to delete an image by its ID
    @ApiOperation({ summary: 'Delete an image by ID' }) // Summary of the operation
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'ID of the image to delete',
        example: 1,
    }) // Parámetro ID
    @ApiResponse({ status: 200, description: 'Image deleted successfully.' }) 
    @ApiResponse({ status: 404, description: 'Image not found.' }) 
    @ApiResponse({ status: 400, description: 'Invalid ID or failed to delete the image.' }) 
    async deleteImage(@Param('id') id: number) {
        const image = await this.imageService.getImage(id);
        if (!image) {
            logger.warn(`No se encontró la imagen con ID ${id}`);
            throw new NotFoundException(`No se encontró la imagen con ID ${id}`);
        }

        await this.firebaseService.deleteImage(image.url);

        await this.imageService.deleteImage(id);
        logger.info(`Imagen con ID ${id} eliminada exitosamente`);
        return { message: `Imagen con ID ${id} eliminada exitosamente` };
    }


    @Post('resize') // Endpoint to resize an image
    @UseInterceptors(FileInterceptor('file')) // Use file interceptor to handle file uploads
    async resizeImage(
        @UploadedFile() file: Express.Multer.File, // The uploaded file
        @Body('width') width: string,  // Width for resizing
        @Body('height') height: string, // Height for resizing
    ) {
        if (!file) {
            throw new BadRequestException('No file provided'); // Throw error if no file is provided
        }

        const widthNumber = parseInt(width, 10); // Parse width as a number
        const heightNumber = parseInt(height, 10); // Parse height as a number


        // Validate that width and height are positive numbers
        if (isNaN(widthNumber) || isNaN(heightNumber) || widthNumber <= 0 || heightNumber <= 0) {
            throw new BadRequestException('Width and height parameters must be positive numbers'); // Throw error
        }

        // Resize the image
        const resizedImageBuffer = await this.imageTransformService.resizeImage(file.buffer, widthNumber, heightNumber);

        // Create a simulated Express.Multer.File object for the resized image
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

        // Upload the resized image to Firebase
        const url = await this.firebaseService.uploadImage(resizedFile);
        return { url }; // Return the URL of the resized image
    }


}
