import { Column } from "typeorm";
import { BasePersistenceEntity } from "./base.persitence.entity";

export class AuditablePersistenceEntity extends BasePersistenceEntity
{
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}