import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcrypt';
export class Migration1728882483081 implements MigrationInterface {
    id = uuid4();
    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = await bcrypt.genSalt(8);
        const password = await bcrypt.hash('123456', salt);
        const newUser = {
            id: this.id,
            name: 'Jhon Doe',
            email: 'jhon@example.com',
            password: password,
        };
        await queryRunner.query(
          `INSERT INTO "users" ("id", "name", "email", "password") VALUES ('${newUser.id}', '${newUser.name}', '${newUser.email}', '${newUser.password}')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "users" WHERE "id" = '${this.id}'`);
    }
}

