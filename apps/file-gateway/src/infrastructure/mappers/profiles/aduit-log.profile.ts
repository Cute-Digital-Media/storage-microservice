import { createMap, forMember, mapFrom } from '@automapper/core'; 
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AuditLogEntity } from 'apps/file-gateway/src/domain/entities/aduit-log.entity';
import { AuditLogPersistence } from '../../persistence/aduit-log.persistence';

@Injectable()
export class AuditLogProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(mapper, AuditLogEntity, AuditLogPersistence,
                forMember(dest => dest.userId, mapFrom(src => src.props.userId)),
                forMember(dest => dest.createdAt, mapFrom(src => src.props.createdAt)),
                forMember(dest => dest.updatedAt, mapFrom(src => src.props.updatedAt)),
                forMember(dest => dest.message, mapFrom(src => src.props.message)),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );

            createMap(mapper, AuditLogPersistence, AuditLogEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    userId: src.userId,
                    updatedAt: src.updatedAt,
                    createdAt: src.createdAt,
                    message: src.message
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
