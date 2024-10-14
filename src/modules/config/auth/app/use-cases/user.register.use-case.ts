import { UserService } from '../../../../user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { UserCreateDto } from '../../../../user/app/dtos/user.create.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtInterface } from '../../payload.interface';
import { UserMapper } from '../../../../user/infra/mapper/user.mapper';
import { UserDomain } from '../../../../user/domain/user.domain';
@Injectable()
export class UserRegisterUseCase {
  constructor(
    @Inject(UserService)private readonly userService: UserService,
    private readonly jwtService: JwtService,
    public readonly userMapper: UserMapper,
  ) {}
  async execute(userCreateDto: UserCreateDto): Promise<AuthResponse> {
    try {
      const user = await this.userService.create(userCreateDto);
      const token = this.getJwtToken({ email: user.email });
      return new AuthResponse(user, token, this.userMapper);
    } catch (error) {
      throw error;
    }
  }
  getJwtToken(payload: JwtInterface) {
    return this.jwtService.sign(payload);
  }
}

export class AuthResponse {
  user: Partial<UserDomain>;
  token: string;
  protected readonly userMapper: UserMapper
  constructor(user: UserDomain,token: string, userMapper: UserMapper ) {
    this.user = userMapper.toView(user);
    this.token = token;
  }
}
