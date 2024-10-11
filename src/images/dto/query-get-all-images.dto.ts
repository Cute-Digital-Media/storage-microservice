import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QueryGetAllImagesDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public page: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public limit: number;
}
