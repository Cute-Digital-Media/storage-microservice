import { Controller, Post, Get, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../services/images.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { Image } from '../../../core/entities/image.entity';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Endpoint para subir una imagen.
   * @param file Archivo de imagen
   * @returns La imagen subida
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<Image> {
    return this.imagesService.uploadImage(file);
  }

  /**
   * Endpoint para obtener todas las imágenes.
   * @returns Lista de imágenes
   */
  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.getAllImages();
  }

  /**
   * Endpoint para obtener una imagen por su ID.
   * @param id ID de la imagen
   * @returns La imagen encontrada
   */
  @Get(':id')
  async getImageById(@Param('id') id: string): Promise<Image> {
    return this.imagesService.getImageById(id);
  }

  /**
   * Endpoint para eliminar una imagen por su ID.
   * @param id ID de la imagen a eliminar
   */
  @Delete(':id')
  async deleteImage(@Param('id') id: string): Promise<void> {
    await this.imagesService.deleteImage(id);
  }
}