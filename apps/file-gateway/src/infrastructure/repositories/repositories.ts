import { Provider } from "@nestjs/common";
import { FileRepository } from "./file.repository";
import { FilePersistence } from "../persistence/file.persistence";
import { UserRepository } from "./user.repository";
import { UserPersistence } from "../persistence/user.persistence";
import { AuditLogRepository } from "./audit-log.repository";


export const RepositoryProviders : Provider[] = [
    {
        useClass: FileRepository, 
        provide: "IFileRepository"
    },
    {
        useClass: UserRepository, 
        provide: "IUserRepository"
    },
    {
        useClass: AuditLogRepository, 
        provide: "IAuditLogRepository"
    }
] 