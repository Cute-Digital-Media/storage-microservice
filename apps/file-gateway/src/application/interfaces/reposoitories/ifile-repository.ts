import { FileEntity } from "apps/file-gateway/src/domain/entities/file.entity";
import { FilePersistence } from "apps/file-gateway/src/infrastructure/persistence/file.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IFileRepository extends IGenericRepository<FileEntity,FilePersistence>{}