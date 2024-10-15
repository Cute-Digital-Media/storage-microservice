import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserPersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public email: string;

}
