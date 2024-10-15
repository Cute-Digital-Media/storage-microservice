import { Bucket, File } from "@google-cloud/storage";
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { ImageDBE } from "src/db/entities/image.db.entity";
import { Repository } from "typeorm";
import { ListFileDto } from "./Dto/list.file.dto";
import { UploadFileDto } from "./Dto/upload.file.dto";

@Injectable()
export class FirebaseStorageService {

    private bucket: Bucket;

    public constructor(
        @InjectFirebaseAdmin() firebase: FirebaseAdmin,
        @InjectRepository(ImageDBE) private imagesRepository: Repository<ImageDBE>,
    ) {
        this.bucket = firebase.storage.bucket();
    };

    async findAll(filters: ListFileDto) {

        let temp: File[];

        const [files] = await this.bucket.getFiles();

        if (filters.folder) {
            temp = files.filter(file =>
                file.metadata?.metadata?.folder === filters.folder);
        };

        if (filters.user) {
            temp = files.filter(file =>
                file.metadata?.metadata?.user === filters.user);
        };

        if (filters.tenant) {
            temp = files.filter(file =>
                file.metadata?.metadata?.tenant === filters.tenant);
        };

        // Implementar paginación
        const page = filters.page || 0;
        const limit = filters.limit || 10;
        const paginatedFiles = temp.slice(page * limit, (page + 1) * limit);

        return {
            data: paginatedFiles.map(file => ({
                name: file.name,
                url: file.publicUrl(),
            })),
            total: temp.length,
            page,
            limit,
        };
    };

    async uploadFile(
        file: Express.Multer.File,
        uploadFileDto: UploadFileDto
    ): Promise<string> {
        try {
            const folderPath = this.constructFolderPath({ ...uploadFileDto });
            const fileUpload = this.getFileReference(folderPath, file.originalname);
            await this.saveFile(fileUpload, file, { ...uploadFileDto });
            const fileUrl = this.getFileUrl(fileUpload);
            await this.saveFileMetadata(Object.assign({ ...uploadFileDto }, { url: fileUrl }, { name: file.originalname }));
            return fileUrl;
        } catch (error) {
            throw new NotFoundException('File upload failed');
        }
    };

    async getFileById(id: number): Promise<string> {
        try {
            const { tenant, user, folder, name } = await this.getFileMetadataById(id);
            const folderPath = this.constructFolderPath({ tenant, user, folder });
            const fileUpload = this.getFileReference(folderPath, name);
            const exists = await fileUpload.exists();
            if (!exists[0]) {
                throw new NotFoundException('File not found');
            }
            return this.getFileUrl(fileUpload);
        } catch (error) {
            throw new NotFoundException('File not found');
        }
    };

    async deleteFile(id: number): Promise<void> {
        try {
            const { tenant, user, folder, name } = await this.getFileMetadataById(id);
            const folderPath = this.constructFolderPath({ tenant, user, folder });
            const fileUpload = this.getFileReference(folderPath, name);
            const exists = await fileUpload.exists();
            if (!exists[0]) {
                throw new NotFoundException('File not found');
            }
            await this.deleteFileMetadata(id);
            await fileUpload.delete();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Could not delete file');
        }
    };

    async deleteFileMetadata(id: number): Promise<void> {
        try {
            const result = await this.imagesRepository.delete({ id: id });

            if (result.affected === 0) {
                throw new NotFoundException('File metadata not found in the database');
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Could not delete file metadata');
        }
    }

    async saveFileMetadata({ ...props }: Partial<ImageDBE>): Promise<void> {
        try {
            await this.imagesRepository.save<Partial<ImageDBE>>(
                props
            );
        } catch (error) {
            throw new InternalServerErrorException('Could not save file metadata');
        }
    }

    async getFileMetadataById(id: number): Promise<ImageDBE> {
        try {
            const fileMetadata = await this.imagesRepository.findOneBy({ id: id });
            return fileMetadata;
        } catch (error) {
            throw new InternalServerErrorException('Could not get file metadata');
        }
    }

    // Obtener la referencia del archivo en Firebase Storage
    private getFileReference(folderPath: string, fileName: string) {
        return this.bucket.file(`${folderPath}/${fileName}`);
    }

    private async saveFile(fileUpload: File, file: Express.Multer.File, metadata: { [key: string]: any }): Promise<void> {
        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype, metadata: metadata }
        });
    }

    // Obtener la URL del archivo
    private getFileUrl(fileUpload: File): string {
        return `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
    }

    private constructFolderPath({ ...props }: UploadFileDto): string {
        const { tenant, user, folder } = props;
        return `${tenant}/${user}/${folder}`;
    }
}
