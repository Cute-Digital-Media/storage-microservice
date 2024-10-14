import { Injectable, NotImplementedException } from "@nestjs/common";
import { IFileStorageService } from "../../application/services/ifile-storage.service";
import { FileModel } from "../../domain/models/file.model";
import { Result } from "libs/common/application/base";
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { AppError } from "libs/common/application/errors/app.errors";
import { EnvVarsAccessor } from "libs/common/configs/env-vars-accessor";

@Injectable()
export class FireBaseStorageService implements IFileStorageService {
    private bucket: Bucket;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: EnvVarsAccessor.FIREBASE_PROJECT_ID,
                clientEmail: EnvVarsAccessor.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        this.bucket = admin.storage().bucket();
    }

    async uploadFileAsync(fileName: string, file: Buffer, isPrivate: boolean, contentType: string): Promise<Result<void>> {
        try {
            const fileRef = this.bucket.file(fileName);
            const stream = fileRef.createWriteStream({
                metadata: {
                    contentType,
                },
                public: !isPrivate,
            });

            return new Promise<Result<void>>((resolve, reject) => {
                stream.on('error', (err) => reject(Result.Fail<void>(new AppError.UnexpectedError())));
                stream.on('finish', async () => {
                    if (!isPrivate) {
                        await fileRef.makePublic(); 
                    }
                    resolve(Result.Ok<void>());
                });
                stream.end(file); 
            });
        } catch (error) {
            return Result.Fail<void>(error.message);
        }
    }

    async editFileAsync(fileName: string, oldPath: string, file: Buffer, isPrivate: boolean, contentType: string): Promise<Result<void>> {
        try {
            await this.deleteFileAsync(oldPath, isPrivate);
            return await this.uploadFileAsync(fileName, file, isPrivate, contentType);
        } catch (error) {
            return Result.Fail<void>(error.message);
        }
    }

    async deleteFileAsync(filePath: string, isPrivate: boolean): Promise<Result<void>> {
        try {
            const fileRef = this.bucket.file(filePath);
            await fileRef.delete();
            return Result.Ok<void>();
        } catch (error) {
            return Result.Fail<void>(error.message);
        }
    }
    async getFileAsync(fileName: string, isPrivate: boolean): Promise<Result<FileModel>> {
        try {
            const fileRef = this.bucket.file(fileName);
            
            const [metadata] = await fileRef.getMetadata();
            
            const buffer: Buffer = await new Promise((resolve, reject) => {
                const chunks: any[] = [];
                const stream = fileRef.createReadStream();
                
                stream.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                stream.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                stream.on('error', (err) => {
                    reject(err);
                });
            });
    
            const fileModel = new FileModel(
                buffer,
                fileName,
                metadata.contentType
            );
    
            return Result.Ok<FileModel>(fileModel);
        } catch (error) {
            return Result.Fail<FileModel>(error.message);
        }
    }
    
}
