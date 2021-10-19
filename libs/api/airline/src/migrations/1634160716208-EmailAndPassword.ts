import {MigrationInterface, QueryRunner} from "typeorm";

export class EmailAndPassword1634160716208 implements MigrationInterface {
    name = 'EmailAndPassword1634160716208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "email"`);
    }

}
