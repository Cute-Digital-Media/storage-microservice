import { createMap, forMember, mapFrom } from '@automapper/core'; 
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'apps/file-gateway/src/domain/entities/user.entity';
import { UserPersistence } from '../../persistence/user.persistence';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(mapper, UserEntity, UserPersistence,
                forMember(dest => dest.email, mapFrom(src => src.props.email)),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );

            createMap(mapper, UserPersistence, UserEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    email: src.email,
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
