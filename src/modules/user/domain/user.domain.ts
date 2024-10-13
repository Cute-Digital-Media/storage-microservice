import { v4 as uuidv4 } from 'uuid';
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

  public static create(id: string = null, name: string, email: string, password: string): UserDomain {
    id = id ? id : uuidv4();
    return new UserDomain(id, name, email, password);
  }
}
