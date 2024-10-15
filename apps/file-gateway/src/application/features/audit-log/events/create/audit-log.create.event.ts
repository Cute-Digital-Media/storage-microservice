import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { IAuditLogRepository } from "apps/file-gateway/src/application/interfaces/reposoitories/iaudit-log.repository";
import { AuditLogEntity } from "apps/file-gateway/src/domain/entities/aduit-log.entity";

export class AuditLogCreatedEvent 
{
    constructor(
        public readonly userId : string , 
        public readonly message: string | object,    
    ) {}
}

@EventsHandler(AuditLogCreatedEvent)
export class AuditLogCreatedEventHandler implements IEventHandler<AuditLogCreatedEvent> 
{
    constructor(
        @Inject("IAuditLogRepository")
        private readonly auditLogRepository: IAuditLogRepository
    ) {}

    async handle(event: AuditLogCreatedEvent) {
        let message = typeof(event.message) == "string"? event.message : JSON.stringify(event.message);     
        await this.auditLogRepository.saveNew(new AuditLogEntity({userId: event.userId, message}))
    }
}

