import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column} from 'typeorm';

@Entity('audit_log')
export class AuditLogPersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public userId: string;

    @AutoMap()
    @Column({ type: 'text'})
    public message: string;
}
