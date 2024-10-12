import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    url: string;

    // Nuevo: Tamaño de la imagen en bytes (validación de tamaño)
    @Column({ type: 'int' })
    size: number;

    // Nuevo: Usuario que subió la imagen (auditoría)
    @Column({ nullable: true })
    uploadedBy: string;

    @CreateDateColumn()
    createdAt: Date;
}
