import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListFileDto {
    @IsOptional()
    @IsString()
    tenant?: string;

    @IsOptional()
    @IsString()
    user?: string;

    @IsOptional()
    @IsString()
    folder?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    page?: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;
}