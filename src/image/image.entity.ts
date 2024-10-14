// imagen.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
    })
    tenant: string;

    @ManyToOne(() => User, (user) => user.imagenes, { onDelete: 'CASCADE' }) // Relación muchos a uno
    user: User; // Relación con el usuario

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
    })
    folder: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    url: string;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
    })
    description: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    thumbnailUrl: string
}
