import {MigrationInterface, QueryRunner} from "typeorm";

export class Float21632629394458 implements MigrationInterface {
    name = 'Float21632629394458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "cash"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "cash" numeric NOT NULL DEFAULT '100000000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "cash"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "cash" integer NOT NULL DEFAULT '100000000'`);
    }

}
