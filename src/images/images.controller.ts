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

@Controller('images')
export class ImageController {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly imageService: ImagesService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
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
    async getImage(@Param('id') id: number) {
        return this.imageService.getImage(id);
    }
}
