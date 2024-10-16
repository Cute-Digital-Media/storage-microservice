export class User {
  id: string;
  email: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
