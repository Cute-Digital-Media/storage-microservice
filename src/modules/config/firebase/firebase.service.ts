import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { ImageDomain } from '../../images/domain/image.domain';
@Injectable()
export class FirebaseService {
  private bucket: any;
  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {
    if (!this.firebaseApp) {
      throw new Error('Firebase app not initialized');
    }
    if (!this.firebaseApp.storage()) {
      throw new Error('Firebase storage not initialized');
    }
    this.bucket = this.firebaseApp.storage().bucket();
  }

  async uploadFile(file: Express.Multer.File): Promise<ResponseFirebase> {
    try {
      // Crear un archivo con un nombre aleatorio

      const id = uuidv4();
      const fileName = `public/${id}.${file.mimetype.split('/')[1]}`;
      const fileUpload = this.bucket.file(fileName);

      // Comprimir la imagen
      const compressedBuffer = await sharp(file.buffer)
        .webp({ quality: 50, nearLossless: true })
        .toBuffer();
      await fileUpload.save(compressedBuffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Hacer que el archivo sea públicamente accesible
      await fileUpload.makePublic();

      // Devolver la URL pública del archivo
      return new ResponseFirebase(id, `https://storage.googleapis.com/${this.bucket.name}/${fileName}`);
    } catch (error) {
      throw error;
    }
  }
  async deleteFile(file: ImageDomain): Promise<void> {
    try{
      const fileName = `${file.id}.${file.type}`;
      const fileUpload = this.bucket.file(`public/${fileName}`);

      // Verifica si el archivo existe antes de intentar eliminarlo
      const [exists] = await fileUpload.exists();
      if (!exists) {
        throw new NotFoundException('File does not exist');
      }
      await fileUpload.delete();
    } catch (error) {
      throw error;
    }
  }
  async updateFile(
    file: ImageDomain,
    newFile: Express.Multer.File,
  ): Promise<ResponseFirebase> {
    try {
      await this.deleteFile(file);
      // Carga el nuevo archivo
      const id = file.id;
      const fileName = `public/${id}.${newFile.mimetype.split('/')[1]}`;
      const fileUpload = this.bucket.file(fileName);

      // Comprimir la imagen
      const compressedBuffer = await sharp(newFile.buffer)
        .webp({ quality: 50, nearLossless: true })
        .toBuffer();
      await fileUpload.save(compressedBuffer, {
        metadata: {
          contentType: newFile.mimetype,
        },
      });

      // Hacer que el archivo sea públicamente accesible
      await fileUpload.makePublic();

      // Devolver la URL pública del archivo
      return new ResponseFirebase(
        id,
        `https://storage.googleapis.com/${this.bucket.name}/${fileName}`,
      );
    } catch (error) {
      throw error;
    }
  }
}

class ResponseFirebase {
  id: string;
  url: string;
  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
  }
}
