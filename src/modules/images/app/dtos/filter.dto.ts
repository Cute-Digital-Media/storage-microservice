import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number;
}
