import { createMap, mapFrom, forMember } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { FileEntity } from 'apps/file-gateway/src/domain/entities/file.entity';
import { FilePersistence } from '../../persistence/file.persistence';
import { AutoMap } from '@automapper/classes';

@Injectable()
export class FileProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, FileEntity,test);
        };
    }
}


export class test{
  @AutoMap()
  public fileName: string
}