import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class BasePersistenceEntity extends BaseEntity
{
    @PrimaryGeneratedColumn('uuid')
    public id: string;
}
