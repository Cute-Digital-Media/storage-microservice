import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class ImageDBE {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tenant: string;

    @Column()
    user: string;

    @Column()
    folder: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;
}

