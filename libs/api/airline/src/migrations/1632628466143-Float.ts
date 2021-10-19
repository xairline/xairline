import {MigrationInterface, QueryRunner} from "typeorm";

export class Float1632628466143 implements MigrationInterface {
    name = 'Float1632628466143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "landing_vs"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "landing_vs" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "landing_g"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "landing_g" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "total_hours"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "total_hours" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "total_hours"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "total_hours" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "landing_g"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "landing_g" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "landing_vs"`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "landing_vs" integer`);
    }

}
