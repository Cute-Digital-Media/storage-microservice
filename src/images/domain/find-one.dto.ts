import { IsOneOfTwoFields } from 'src/_shared/validator/Is-one-of-two-fields.validator';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOneImageDto {
  @ApiPropertyOptional({
    description: 'Unique identifier of the entity',
    example: '1',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Folder Name',
    example: 'Example Namecarlo',
  })
  @IsOptional()
  @IsString()
  folderName?: string;
  @IsOneOfTwoFields('id', 'folderName', {
    message: 'Either id or filename must be provided',
  })
  validateEitherIdOrFilename: boolean;
}
