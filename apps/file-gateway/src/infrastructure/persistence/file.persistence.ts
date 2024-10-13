import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FilePersistence  extends AuditablePersistenceEntity{
    @Column({ type: 'text'})
    filename: string;
}
