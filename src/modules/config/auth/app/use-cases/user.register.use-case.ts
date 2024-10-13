import { UserService } from '../../../../user/user.service';
import { Injectable } from '@nestjs/common';
import { UserCreateDto } from '../../../../user/app/dtos/user.create.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface } from '../../payload.interface';
@Injectable()
export class UserRegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(userCreateDto: UserCreateDto): Promise<any> {
    try {
      const user = await this.userService.create(userCreateDto);
      const token = this.getJwtToken({ email: user.email });
      return {
        user: user.email,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  getJwtToken(payload: JwtInterface) {
    return this.jwtService.sign(payload);
  }
}
