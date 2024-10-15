import { createMap, forMember, mapFrom } from '@automapper/core'; 
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { FileEntity } from 'apps/file-gateway/src/domain/entities/file.entity';
import { FilePersistence } from '../../persistence/file.persistence';
import { UserPersistence } from '../../persistence/user.persistence';
import { UserEntity } from 'apps/file-gateway/src/domain/entities/user.entity';

@Injectable()
export class FileProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            // Mapeo de FileEntity a FilePersistence
            createMap(mapper, FileEntity, FilePersistence, 
                forMember(dest => dest.fileName, mapFrom(src => src.props.fileName)),
                forMember(dest => dest.type, mapFrom(src => src.props.type)),
                forMember(dest => dest.size, mapFrom(src => src.props.size)),
                forMember(dest => dest.metadata, mapFrom(src => src.props.metadata)),
                forMember(dest => dest.url, mapFrom(src => src.props.url)),
                forMember(dest => dest.userId, mapFrom(src => src.props.userId)),
                forMember(dest => dest.isPrivate, mapFrom(src => src.props.isPrivate)),
                forMember(dest => dest.originalFileName, mapFrom(src => src.props.originalFileName)),
                forMember(dest => dest.thumbnailFileName, mapFrom(src => src.props.thumbnailFileName)),
                forMember(dest => dest.user, mapFrom(src => {
                    return this.mapper.map(src.props.user, UserEntity, UserPersistence); 
                }))
            );

            createMap(mapper, FilePersistence, FileEntity,
                forMember(dest => dest.props, mapFrom(src => ({
                    fileName: src.fileName,
                    type: src.type,
                    size: src.size,
                    metadata: src.metadata,
                    url: src.url,
                    userId: src.userId,
                    isPrivate: src.isPrivate,
                    originalFileName: src.originalFileName,
                    thumbnailFileName: src.thumbnailFileName,
                    user: this.mapper.map(src.user, UserPersistence, UserEntity)
                }))),
                forMember(dest => dest.id, mapFrom(src => src.id))
            );
        };
    }
}
