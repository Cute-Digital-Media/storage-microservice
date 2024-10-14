import { Provider } from "@nestjs/common";
import { FileRepository } from "./file.repository";
import { FilePersistence } from "../persistence/file.persistence";
import { UserRepository } from "./user.repository copy";
import { UserPersistence } from "../persistence/user.persistence";

export const PersistenceEntities = [
    FilePersistence,
    UserPersistence
]

export const RepositoryProviders : Provider[] = [
    {
        useClass: FileRepository, 
        provide: "IFileRepository"
    },
    {
        useClass: UserRepository, 
        provide: "IUserRepository"
    }
] 