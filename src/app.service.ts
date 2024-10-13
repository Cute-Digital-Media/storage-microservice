import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles/application/roles.service';
import { UsersService } from './users/application/users.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    await this.ensureDefaultRoleExists();
  }

  private async ensureDefaultRoleExists() {
    const roleName = 'admin';
    let role;
    try {
      role = await this.rolesService.findOne({
        where: { name: roleName },
      });
    } catch {
      role = await this.rolesService.save({ name: roleName });
    }
    const userName = process.env.ADMIN_NAME;
    const userEmail = process.env.ADMIN_EMAIL;
    const sdsd = process.env.TENANT_ID;
    try {
      await this.usersService.findOne({
        where: { username: userName, email: userEmail },
      });
    } catch {
      await this.usersService.save({
        username: userName,
        password: process.env.ADMIN_PASSWORD,
        email: process.env.ADMIN_EMAIL,
        tenantId: process.env.TENANT_ID,
        role: role,
      });
    }
  }
}
