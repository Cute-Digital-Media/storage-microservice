import { Inject, Injectable, Logger } from "@nestjs/common";
import { IAuditLogRepository } from "../interfaces/reposoitories/iaudit-log.repository";
import { AuditLogEntity } from "../../domain/entities/aduit-log.entity";
import { EventBus } from "@nestjs/cqrs";
import { AuditLogCreatedEvent } from "../features/audit-log/events/create/audit-log.create.event";

export interface ILoggerService 
{
    info(message: string | any); 
    error(message: string | any); 
    warn(message: string | any); 
    auditAsync(userId: string,message: string | any); 
}

// Basic implementation for now, later maybe extend it with Seq or other external logging service 
@Injectable()
export class LoggerService extends Logger implements ILoggerService
{
    constructor(
        private readonly eventBus: EventBus
    ) {
        super("FileGateWay");
    }

    async auditAsync(userId: string, message: string | any) {
        await this.eventBus.publish(new AuditLogCreatedEvent(userId,message))
        return this.info(message); 
    }

    info(message: string | any) {
        return this.log(message); 
    }
}
