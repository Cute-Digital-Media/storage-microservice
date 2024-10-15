import { UserEntity } from "apps/file-gateway/src/domain/entities/user.entity";
import { UserPersistence } from "apps/file-gateway/src/infrastructure/persistence/user.persistence";
import { IGenericRepository } from "libs/common/application/interfaces/igeneric-repository";

export interface IUserRepository extends IGenericRepository<UserEntity,UserPersistence>{}