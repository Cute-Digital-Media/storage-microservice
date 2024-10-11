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

  async handleResizeAndSend(file: Express.Multer.File) {
    const uuid = uuidv4(); // Genera un UUID único para el nombre del archivo
    const fileName = `${uuid}-${file.originalname}`; // Crea el nombre del archivo
    const bucket = this.storage.bucket(this.firebaseApp.options.storageBucket); // Obtiene el bucket de Firebase
    const fileUpload = bucket.file(fileName); // Crea un archivo en el bucket

    let processedBuffer: Buffer = file.buffer; // Buffer de la imagen, inicialmente el original

    // Intenta redimensionar y optimizar la imagen
    try {
      processedBuffer = await this.imageResizeService.resizeAndOptimize(
        file.buffer,
        800, // Ancho deseado
        600, // Alto deseado
        'webp', // Formato de salida (webp para mejor calidad/tamaño)
      );
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      // Maneja el error como desees, por ejemplo, subir la imagen original sin procesar.
      // En este caso, simplemente se continúa con el buffer original.
    }

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

    // Aquí puedes subir el buffer redimensionado a Firebase o realizar otras acciones
    console.log(`Imagen redimensionada y lista para ser subida: ${fileName}`);
    // Implementa la lógica para subir la imagen redimensionada a Firebase aquí
  }
}
