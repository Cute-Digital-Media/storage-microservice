import { Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { IFileStorageService } from "../../application/services/ifile-storage.service";
import { FileModel } from "../../domain/models/file.model";
import { Result } from "libs/common/application/base";
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { AppError } from "libs/common/application/errors/app.errors";
import { EnvVarsAccessor } from "libs/common/configs/env-vars-accessor";
import { ILoggerService } from "../../application/services/ilogger.service";

@Injectable()
export class FireBaseStorageService implements IFileStorageService {
    private bucket: Bucket;

    constructor(
        @Inject("ILoggerService")
        private readonly logger: ILoggerService
    ) {
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
            this.logger.info(`Uploading file: ${fileName}, Private: ${isPrivate}`);            
            const fileRef = this.bucket.file(fileName);
            await fileRef.save(file, {
                metadata: {
                    contentType,
                },
                public: !isPrivate,
            });    
            if (!isPrivate) {
                await fileRef.makePublic();
            }
    
            this.logger.info(`File uploaded successfully: ${fileName}`);
            return Result.Ok<void>();
        } catch (error) {
            this.logger.error(`Error in uploadFileAsync: ${error.message}`);
            return Result.Fail<void>(error.message);
        }
    }
    
    async editFileAsync(fileName: string, oldPath: string, file: Buffer, isPrivate: boolean, contentType: string): Promise<Result<void>> {
        try {
            this.logger.info(`Editing file: ${fileName}, deleting old file: ${oldPath}`);
            await this.deleteFileAsync(oldPath, isPrivate);
            return await this.uploadFileAsync(fileName, file, isPrivate, contentType);
        } catch (error) {
            this.logger.error(`Error in editFileAsync: ${error.message}`);
            return Result.Fail<void>(error.message);
        }
    }

    async deleteFileAsync(filePath: string, isPrivate: boolean): Promise<Result<void>> {
        try {
            this.logger.info(`Deleting file: ${filePath}`);
            const fileRef = this.bucket.file(filePath);
            await fileRef.delete();
            this.logger.info(`File deleted successfully: ${filePath}`);     
            return Result.Ok<void>();
        } catch (error) {
            this.logger.error(`Error in deleteFileAsync: ${error.message}`);
            return Result.Fail<void>(error.message);
        }
    }
    async getFileAsync(fileName: string, isPrivate: boolean): Promise<Result<FileModel>> {
        try {
            
            this.logger.info(`Fetching file: ${fileName}`);
            const fileRef = this.bucket.file(fileName);
            const [metadata] = await fileRef.getMetadata();
            
            const buffer: Buffer = await new Promise((resolve, reject) => {
                const chunks: any[] = [];
                const stream = fileRef.createReadStream();
                
                stream.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                stream.on('end', () => {
                    if (chunks.length === 0) {
                        this.logger.warn('No data received from the file stream.');
                    }
                    resolve(Buffer.concat(chunks));
                });
                stream.on('error', (err) => {
                    this.logger.error(`Error reading file: ${fileName}`);
                    reject(err);
                });
            });
            const fileModel = new FileModel(
                buffer,
                fileName,
                metadata.contentType
            );
            this.logger.info(`File fetched successfully: ${fileName}`);
            return Result.Ok<FileModel>(fileModel);
        } catch (error) {
            this.logger.error(`Error in getFileAsync: ${error.message}`);
            return Result.Fail<FileModel>(error.message);
        }
    }
    
}
