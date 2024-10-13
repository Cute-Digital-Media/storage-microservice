import { Inject } from '@nestjs/common';
import { ImageResizeService } from 'src/_shared/aplication/image-resize.service';
import { v4 as uuidv4 } from 'uuid';

export class ImageProcessing {
  private storage: Storage;

  constructor(
    private imageResizeService: ImageResizeService,
    @Inject('FIREBASE_ADMIN') private firebaseApp,
  ) {
    this.storage = this.firebaseApp.storage();
  }

  async createFolder(folderName: string, bucket: any): Promise<string> {
    const folderPath = `${folderName}`;
    console.log(folderPath);

    const result = await bucket.file(folderPath); //.save(null);
    console.log(result);
    return folderPath;
  }

  async handleResizeAndSend(
    file: Express.Multer.File,
    user_id: number,
    folder_name: string,
    tenantId: string,
  ):Promise<string> {
    const uuid = uuidv4(); // Genera un UUID único para el nombre del archivo
    const fileName = `${file.originalname}-${uuid}`; // Crea el nombre del archivo
    const bucket = this.storage.bucket(this.firebaseApp.options.storageBucket); // Obtiene el bucket de Firebase
    const folderPath = await this.createFolder(
      `${tenantId}/${user_id}/${folder_name ? folder_name : ''}`,
      bucket,
    );
    console.log(folderPath);
    const fileUpload = bucket.file(`${folderPath}/${fileName}`); // Crea un archivo en el bucket

    let processedBuffer: Buffer = file.buffer; // Buffer de la imagen, inicialmente el original

    // Intenta redimensionar y optimizar la imagen
    processedBuffer = await this.imageResizeService.resizeAndOptimize(
      file.buffer,
      800, // Ancho deseado
      600, // Alto deseado
      'webp', // Formato de salida (webp para mejor calidad/tamaño)
    );

    // Crea un stream para subir el archivo
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: 'image/webp', // Establece el tipo de contenido - importante que coincida con el formato de salida
      },
    });

    // Escribe el buffer de la imagen (procesado o original) en el stream
    blobStream.end(processedBuffer);

    // Espera a que la subida se complete
    await new Promise<void>((resolve, reject) => {
      blobStream.on('finish', resolve);
      blobStream.on('error', reject);
    });

    // Obtiene la URL pública del archivo subido
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Fecha de expiración de la URL
    });

    return url; // Retorna la URL del archivo
  }
}
