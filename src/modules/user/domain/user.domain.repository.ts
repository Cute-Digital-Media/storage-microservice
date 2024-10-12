import { UserDomain } from './user.domain';
export interface UserDomainRepository {
  save(user: UserDomain): Promise<void>;
  findByEmail(email: string): Promise<UserDomain>;
}
