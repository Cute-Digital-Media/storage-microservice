import { AuditLogEntity } from "apps/file-gateway/src/domain/entities/aduit-log.entity";
import { AuditLogPersistence } from "apps/file-gateway/src/infrastructure/persistence/aduit-log.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IAuditLogRepository extends IGenericRepository<AuditLogEntity,AuditLogPersistence>{}