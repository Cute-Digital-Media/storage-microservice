import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ImageFilter {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  tenant?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  folderName?: string;
}
