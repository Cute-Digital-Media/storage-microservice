import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Queue } from 'bullmq';
import { InjectImageSendyQueue } from 'src/_shared/queue/infrastructure/inject-queue.decorator';
import { queueOpsEnums } from 'src/_shared/queue/domain/queue-ops-enum.interface';
import { UploadImageDto } from '../domain/upload-image.dto';
import { SearchImageDto } from '../domain/search-image.dto';
import { Payload } from 'src/_shared/domain/request-user';
import { Image } from '../domain/image.enity';
import { BaseService } from 'src/_shared/aplication/base-service.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ImagesService extends BaseService<Image> {
  private storage: Storage;

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseApp,
    @InjectImageSendyQueue() private imageSendyQueue: Queue,
    @InjectRepository(Image)
    private readonly userRepository: Repository<Image>,
  ) {
    super(userRepository);

    this.storage = this.firebaseApp.storage(); // Obtiene la instancia de Firebase Storage
  }

  async uploadImage(
    file: Express.Multer.File,
    uploadImageDto: UploadImageDto,
    payload: Payload,
  ): Promise<string> {
    await this.imageSendyQueue.add(queueOpsEnums.Send, {
      file: file,
      dto: uploadImageDto,
      payload: payload,
    });
    return 'En proceso de redimensionamiento y subida';
  }

  async checkFileExists(filePath: string): Promise<any> {
    try {
      const bucket = this.storage.bucket(
        this.firebaseApp.options.storageBucket,
      );
      const tenantId = '1234-5678-9012-3456';
      const user_id = 1;
      const folder_name = 'images';
      const folderPath = `${tenantId}/${user_id}/${folder_name ? folder_name : ''}`;
      const file = bucket.file(`${folderPath}/${filePath}`);

      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error('Error checking file:', error);
      return false;
    }
  }

  async searchImagesWithFilters(
    filePath: string,
    searchImageDto: SearchImageDto,
  ): Promise<any> {}

  async getImageUrl(fileName: string): Promise<any[]> {
    const bucket = this.storage.bucket(this.firebaseApp.options.storageBucket);
    const options = {
      prefix: fileName, // Prefijo de nombres de imagenes a buscar
    };
    const [files] = await bucket.getFiles(options); // Buscando archivos que tengan como prefijo: fileName
    const urls = [];
    console.log('Files:');
    files.forEach((file) => {
      urls.push({ name: file.name, url: file.metadata.mediaLink });
    });
    if (!urls.length) {
      // Verifica si se encontro alguna imagen con ese prefijo
      throw new NotFoundException('Imagen no encontrada'); // Lanza una excepción si no existe
    }
    return urls;
  }

  async deleteFile(fileName: string, filePath: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(
        this.firebaseApp.options.storageBucket,
      );
      const file = bucket.file(`${filePath}/${fileName}`);

      await file.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}
