import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @MinLength(5)
  title: string;
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  firebaseImage?: string;
}
