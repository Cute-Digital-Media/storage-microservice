import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    url: string;

    @Column({ type: 'int' })
    size: number;

    @Column({ nullable: true })
    uploadedBy: string;

    @CreateDateColumn()
    createdAt: Date;
}
