import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../../../core/entities/image.entity';
import { FirebaseConfig } from '../../../infrastructure/firebase/firebase.config';
import { UploadImageDto } from '../dtos/upload-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private firebaseConfig: FirebaseConfig,
  ) {}

  /**
   * Sube una imagen a Firebase Storage y guarda sus metadatos en la base de datos.
   * @param file Archivo de imagen a subir
   * @returns La imagen guardada
   */
  async uploadImage(file: Express.Multer.File): Promise<Image> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo excede el tamaño máximo permitido');
    }

    const bucket = this.firebaseConfig.getStorage().bucket();
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const image = new Image();
    image.filename = fileName;
    image.url = url;
    image.mimeType = file.mimetype;
    image.size = file.size;

    return this.imageRepository.save(image);
  }

  /**
   * Obtiene todas las imágenes almacenadas.
   * @returns Lista de imágenes
   */
  async getAllImages(): Promise<Image[]> {
    return this.imageRepository.find();
  }

  /**
   * Obtiene una imagen por su ID.
   * @param id ID de la imagen
   * @returns La imagen encontrada
   */
  async getImageById(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }
    return image;
  }

  /**
   * Elimina una imagen por su ID.
   * @param id ID de la imagen a eliminar
   */
  async deleteImage(id: string): Promise<void> {
    const image = await this.getImageById(id);
    const bucket = this.firebaseConfig.getStorage().bucket();
    await bucket.file(image.filename).delete();
    await this.imageRepository.remove(image);
  }
}