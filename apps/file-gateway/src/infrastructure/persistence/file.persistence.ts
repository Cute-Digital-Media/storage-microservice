import { BaseEntity, PrimaryGeneratedColumn } from "typeorm";

export class FilePersistence extends BaseEntity
{
    @PrimaryGeneratedColumn('uuid')
    public id: string;
} 