import { createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { FileEntity } from 'apps/file-gateway/src/domain/entities/file.entity';
import { CreateFileDto } from 'apps/file-gateway/src/application/features/file/commands/create/file.create.dto.command';

@Injectable()
export class FileProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, FileEntity, CreateFileDto);
    };
  }
}
