import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
