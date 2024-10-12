import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectImageSendyQueue } from 'src/_shared/queue/infrastructure/inject-queue.decorator';
import { queueOpsEnums } from 'src/_shared/queue/domain/queue-ops-enum.interface';
@Injectable()
export class ImagesService {
  private storage: Storage;

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseApp,
    @InjectImageSendyQueue() private imageSendyQueue: Queue,
  ) {
    this.storage = this.firebaseApp.storage(); // Obtiene la instancia de Firebase Storage
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    await this.imageSendyQueue.add(queueOpsEnums.Send, file);
    return 'En proceso de redimensionamiento y subida';
  }

  async getImageUrl(fileName: string): Promise<string> {
    const bucket = this.storage.bucket(this.firebaseApp.options.storageBucket);
    const file = bucket.file(fileName);

    // Verifica si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      throw new NotFoundException('Imagen no encontrada'); // Lanza una excepción si no existe
    }

    // Genera una URL firmada para el archivo
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Fecha de expiración de la URL - modifícala según tus necesidades
    });

    return url;
  }
}
