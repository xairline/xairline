import {MigrationInterface, QueryRunner} from "typeorm";

export class Callsign1634053765378 implements MigrationInterface {
    name = 'Callsign1634053765378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "callsign" character varying NOT NULL DEFAULT 'XA'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" ALTER COLUMN "cash" SET DEFAULT '300000000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" ALTER COLUMN "cash" SET DEFAULT '100000000'`);
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "callsign"`);
    }

}
