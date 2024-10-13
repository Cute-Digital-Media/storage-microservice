import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ default: 'test_user' })
  username: string;

  @ApiProperty({ default: 'test_pass' })
  password: string;
}
