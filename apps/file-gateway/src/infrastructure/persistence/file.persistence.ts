import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FilePersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public fileName: string;

    @AutoMap()
    @Column({ type: 'text'})
    public type: string

    @AutoMap()
    @Column({ type: 'float'})
    public size: number   

    @AutoMap()
    @Column({ type: 'json', nullable: true})
    public metadata: object

    @AutoMap()
    @Column({ type: 'text', nullable: true})
    public url?: string

}
