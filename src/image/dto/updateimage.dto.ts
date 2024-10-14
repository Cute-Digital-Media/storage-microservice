import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
    @ApiProperty({
        description: 'Unique identifier of the image',
        type: Number,
    })
    @IsNotEmpty()
    @IsInt()
    id: number;

    @ApiProperty({
        description: 'Description of the image',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    description: string;
}
