import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Queue } from 'bullmq';
import { InjectImageQueue } from 'src/_shared/queue/infrastructure/inject-queue.decorator';
import { queueOpsEnums } from 'src/_shared/queue/domain/queue-ops-enum.interface';
import { UploadImageDto } from '../domain/upload-image.dto';
import { SearchImageDto } from '../domain/search-image.dto';
import { Payload } from 'src/_shared/domain/request-user';
import { ImageEntity } from '../domain/image.enity';
import { BaseService } from 'src/_shared/aplication/base-service.service';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneImageDto } from '../domain/find-one.dto';
import { FindAllDto } from '../domain/find.dto';
@Injectable()
export class ImagesService extends BaseService<ImageEntity> {
  private storage: Storage;

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseApp,
    @InjectImageQueue() private imageQueue: Queue,

    @InjectRepository(ImageEntity)
    private readonly userRepository: Repository<ImageEntity>,
  ) {
    super(userRepository);

    this.storage = this.firebaseApp.storage(); // Obtiene la instancia de Firebase Storage
  }

  async uploadImage(
    file: Express.Multer.File,
    uploadImageDto: UploadImageDto,
    payload: Payload,
  ): Promise<string> {
    await this.imageQueue.add(queueOpsEnums.Send, {
      file: file,
      dto: uploadImageDto,
      payload: payload,
    });
    return 'In the process of resizing and uploading';
  }

  async findOneImage(filter: FindOneImageDto) {
    const { id, folderName } = filter;

    if (!id && !folderName) {
      throw new BadRequestException('Either id or name must be provided');
    }

    const options: FindOneOptions<ImageEntity> = {
      where: {},
    };

    if (id) {
      options.where = { ...options.where, id };
    }
    if (folderName) {
      options.where = { ...options.where, folder_name: folderName };
    }

    return this.findOne(options);
  }

  async findAllImage(filter: FindAllDto) {
    const { tenantId, userId, folderName, ...pagination } = filter;
    const where: FindOptionsWhere<ImageEntity> = {};

    if (tenantId) {
      where.tenant_id = tenantId;
    }
    if (userId) {
      where.user_id = userId;
    }
    if (folderName) {
      where.folder_name = folderName;
    }

    return this.findAll({ where }, pagination);
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
      throw new NotFoundException('Image not found'); // Lanza una excepción si no existe
    }
    return urls;
  }

  async deleteFile(fileName: string, folderPath: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(
        this.firebaseApp.options.storageBucket,
      );
      const file = bucket.file(`${folderPath}/${fileName}`);

      const ds = await file.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async deleteImage(id: number): Promise<string> {
    const image = await this.findOne({ where: { id } });
    await this.imageQueue.add(queueOpsEnums.Delete, {
      id,
      fileName: image.file_name,
      folderPath: image.folder_path,
    });
    return 'In the process of resizing and uploading';
  }
}
