import { createMap, forMember, mapFrom } from '@automapper/core'; 
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { FileEntity, FileEntityProps } from 'apps/file-gateway/src/domain/entities/file.entity';
import { FilePersistence } from '../../persistence/file.persistence';

@Injectable()
export class FileProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(mapper, FileEntity, FilePersistence, 
                forMember(
                    dest => dest.fileName,
                    mapFrom(src => src.props.fileName)
                ),
                forMember(
                    dest => dest.type,
                    mapFrom(src => src.props.type) 
                ),
                forMember(
                    dest => dest.size,
                    mapFrom(src => src.props.size) 
                ),
                forMember(
                    dest => dest.metadata,
                    mapFrom(src => src.props.metadata) 
                ),
                forMember(
                    dest => dest.url,
                    mapFrom(src => src.props.url) 
                )
            );

            createMap(mapper, FilePersistence, FileEntity,
                forMember(
                    dest => dest.props,
                    mapFrom(src => ({
                        fileName: src.fileName,
                        type: src.type,
                        size: src.size,
                        metadata: src.metadata,
                        url: src.url
                    })),
                ), 
                forMember(
                    dest => dest.id, 
                    mapFrom(src => src.id)
                )
            );
        };
    }
}
