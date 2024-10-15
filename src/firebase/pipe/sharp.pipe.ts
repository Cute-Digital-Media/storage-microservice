import { Injectable, PipeTransform } from "@nestjs/common";
import * as fs from 'fs/promises';
import * as path from "path";
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>> {
    async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
        if (!file || !file.originalname) {
            throw new Error('File is undefined or missing original name');
        }

        // Procesar la imagen
        const originalName = path.parse(file.originalname).name;
        const newFilename = Date.now() + '-' + originalName + '.webp';

        const resizedBuffer = await sharp(file.buffer)
            .resize(800) // Redimensionar la imagen
            .webp({ effort: 3 }) // Convertir a WebP
            .toBuffer(); // Obtener el buffer de la imagen redimensionada

        // Guardar la imagen procesada
        //await sharp(resizedBuffer).toFile(newFilename);

        // Obtener el tamaño del nuevo archivo
        //const stats = await fs.stat(newFilename); // Obtener información del archivo

        // Actualizar el objeto file
        file.buffer = resizedBuffer; // Actualizar el buffer al nuevo buffer redimensionado
        file.size = resizedBuffer.length; // Actualizar el tamaño al del nuevo archivo
        file.originalname = newFilename; // Actualizar el nombre del archivo

        return file; // Devolver el objeto file completo
    }
}