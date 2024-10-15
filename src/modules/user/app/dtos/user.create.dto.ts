import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @Length(3, 100)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 100)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
