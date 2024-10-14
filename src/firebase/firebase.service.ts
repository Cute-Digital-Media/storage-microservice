import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccountJson from '../config/firebasekey.json';
import { ConfigService } from '@nestjs/config';



const serviceAccount = serviceAccountJson as admin.ServiceAccount;
@Injectable()
export class FirebaseService {
    constructor(
        private readonly configService: ConfigService
    ) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: this.configService.get('firebase.id')

        });

    }

    public async uploadImage(filePath: string, buffer: Buffer): Promise<string> {
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);

        // Subir el buffer de la imagen
        await file.save(buffer, {
            metadata: {
                contentType: 'image/jpeg', // Cambia esto según el tipo de la imagen
            },
            public: true, // Si quieres que la imagen sea pública
        });

        // Obtener la URL de la imagen
        const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        return url;
    }

    public async deleteImage(imageUrl: string): Promise<void> {
        const bucket = admin.storage().bucket();
        const fileName = imageUrl.split('/').pop(); // Obtiene el nombre del archivo del URL
        const file = bucket.file(fileName);

        await file.delete();
    }


}
