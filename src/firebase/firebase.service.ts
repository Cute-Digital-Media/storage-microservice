/* eslint-disable prettier/prettier */
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Multer } from 'multer';

@Injectable()
export class FirebaseService {
    private bucket: any;

    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App) {
        this.bucket = this.firebaseApp.storage().bucket();
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        // Validación del tamaño máximo (5 MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new BadRequestException('El archivo supera el tamaño máximo permitido (5 MB)');
        }

        const blob = this.bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                console.error('Error subiendo archivo:', err);
                reject(new BadRequestException('No se pudo subir la imagen'));
            });

            blobStream.on('finish', () => {
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }

    async deleteImage(url: string): Promise<void> {
        const bucket = admin.storage().bucket();

        // Extraer el nombre del archivo y decodificarlo.
        const fileName = decodeURIComponent(url.split('/').pop().split('?')[0]);

        const file = bucket.file(fileName);

        try {
            await file.delete();
            console.log(`Archivo ${fileName} eliminado de Firebase Storage.`);
        } catch (error) {
            console.error(`Error al eliminar archivo ${fileName}:`, error);
            throw new BadRequestException('No se pudo eliminar la imagen');
        }
    }

}
