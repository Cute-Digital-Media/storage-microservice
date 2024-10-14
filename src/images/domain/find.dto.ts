import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/_shared/domain/pagination.dto';

export class FindAllDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Tenant ID', example: 'tenant123' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'User ID', example: 'user123' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'Folder name', example: 'folder123' })
  @IsOptional()
  @IsString()
  folderName?: string;
}
