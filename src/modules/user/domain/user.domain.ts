import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
export class UserDomain {
  id: string;
  name: string;
  email: string;
  password: string;
  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public static create(
    name: string,
    email: string,
    password: string,
    id?: string,
  ): UserDomain {
    id = id ?? uuidv4();
    return new UserDomain(id, name, email, password);
  }
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(8);
    return await bcrypt.hash(password, salt);
  }
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
