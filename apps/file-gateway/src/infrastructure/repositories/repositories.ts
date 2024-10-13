import { Provider } from "@nestjs/common";
import { FileRepository } from "./file.repository";
import { FilePersistence } from "../persistence/file.persistence";

export const PersistenceEntities = [
    FilePersistence
]

export const RepositoryProviders : Provider[] = [
    {
        useClass: FileRepository, 
        provide: "IFileRepository"
    }
] 