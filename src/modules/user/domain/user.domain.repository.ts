import { UserDomain } from './user.domain';
export interface UserDomainRepository {
  save(user: UserDomain): Promise<UserDomain>;
  findByEmail(email: string): Promise<UserDomain>;
}
