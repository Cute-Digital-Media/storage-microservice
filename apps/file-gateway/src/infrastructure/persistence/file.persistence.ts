import { AutoMap } from '@automapper/classes';
import { AuditablePersistenceEntity } from 'libs/common/infrastructure/persistence/auditable.persistence.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserPersistence } from './user.persistence';

@Entity('file')
export class FilePersistence extends AuditablePersistenceEntity{
    @AutoMap()
    @Column({ type: 'text'})
    public fileName: string;

    @AutoMap()
    @Column({ type: 'text'})
    public originalFileName: string;

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

    @AutoMap()
    @Column({ type: 'text', name: "user_id"})
    public userId?: string

    @AutoMap()
    @Column({ type: 'boolean'})
    public isPrivate: boolean   

    @AutoMap()
    @Column({ type: 'text'})
    public thumbnailFileName: string 

    @AutoMap()
    @ManyToOne(() => UserPersistence)
    @JoinColumn({ name: 'user_id' })
    user?: UserPersistence;
}
