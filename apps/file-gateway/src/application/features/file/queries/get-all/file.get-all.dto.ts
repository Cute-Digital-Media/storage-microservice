import { FilePersistence } from "apps/file-gateway/src/infrastructure/persistence/file.persistence";
import { FindManyOptions } from "typeorm";

export class GetAllFilesDto implements FindManyOptions<FilePersistence> {}