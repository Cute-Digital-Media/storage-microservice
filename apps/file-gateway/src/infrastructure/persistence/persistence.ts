import { AuditLogPersistence } from "./aduit-log.persistence";
import { FilePersistence } from "./file.persistence";
import { UserPersistence } from "./user.persistence";

export const PersistenceEntities = [
    UserPersistence,
    FilePersistence,
    AuditLogPersistence
]