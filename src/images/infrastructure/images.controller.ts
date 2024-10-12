// image.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../aplication/images.service';

@Controller('image')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Intercepta el archivo subido con el nombre 'image'
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return await this.imageService.uploadImage(file); // Llama al servicio para subir la imagen
  }

  @Get(':fileName') // Ruta para obtener la URL de la imagen por nombre de archivo
  async getImageUrl(
    @Param('fileName') fileName: string,
  ): Promise<{ url: string }> {
    try {
      const url = await this.imageService.getImageUrl(fileName);
      return { url };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message); // Relanza la excepción si la imagen no se encuentra
      }
      throw error; // Relanza cualquier otra excepción
    }
  }
}
