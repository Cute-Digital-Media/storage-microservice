import { UserRole } from '../enum/role.enum';

export class UserDto {
  userId: number;
  username: string;
  password: string;
  tenant: string;
  role: UserRole;
}
