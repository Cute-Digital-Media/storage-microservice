import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728607177169 implements MigrationInterface {
    name = 'Migration1728607177169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "file" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "size" integer NOT NULL,
                "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "uploadedBy" character varying,
                CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."thumbnail_type_enum" AS ENUM('SMALL', 'MEDIUM')
        `);
        await queryRunner.query(`
            CREATE TABLE "thumbnail" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying NOT NULL,
                "type" "public"."thumbnail_type_enum" NOT NULL DEFAULT 'SMALL',
                "fileId" uuid NOT NULL,
                CONSTRAINT "PK_12afcbe5bdad28526b88dbdaf3f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "thumbnail"
            ADD CONSTRAINT "FK_9304cac56e198bdb092f58f8aa5" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "thumbnail" DROP CONSTRAINT "FK_9304cac56e198bdb092f58f8aa5"
        `);
        await queryRunner.query(`
            DROP TABLE "thumbnail"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."thumbnail_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "file"
        `);
    }

}
