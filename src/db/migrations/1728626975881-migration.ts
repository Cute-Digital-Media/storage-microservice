import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728626975881 implements MigrationInterface {
    name = 'Migration1728626975881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "file"
            ADD "isActive" boolean NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "file" DROP COLUMN "isActive"
        `);
    }

}
