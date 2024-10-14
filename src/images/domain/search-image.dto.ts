import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Matches,
  IsUUID,
} from 'class-validator';

export class SearchImageDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty({
    description:
      'Name of the folder to upload the image. If it is empty, the image will be uploaded in the root folder',
    example: 'images',
  })
  @IsString()
  @Matches(/(^[a-z0-9.]*$)/, { message: 'Cannot contain characters like /' })
  folder_name: string;

  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: 'a3e95e9c-72be-4d89-a032-abc123def456',
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
