import { Result } from "libs/common/application/base";
import { FileModel } from "../../domain/models/file.model";

export interface IFileStorageService {

    uploadFileAsync(fileName: string, file: Buffer, isPrivate: boolean, contentType: string): Promise<Result<void>>;

    editFileAsync(fileName: string, oldPath: string, file: Buffer, isPrivate: boolean, contentType: string): Promise<Result<void>>;

    deleteFileAsync(filePath: string, isPrivate: boolean): Promise<Result<void>>;

    getFileAsync(fileName: string, isPrivate: boolean): Promise<Result<Buffer>>;
}
