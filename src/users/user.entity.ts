import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image, } from "../image/image.entity";
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 96,
        nullable: false,
    })
    password: string;

    @Column("text", {
        array: true,
        nullable: false,
    })
    rol: string[]

    @Column({
        type: 'varchar',
        nullable: false,
    })
    tenant: string

    @OneToMany(() => Image, (image) => image.user, { nullable: true }) // Hacer la relación opcional
    imagenes?: Image[]; // Opcional

}