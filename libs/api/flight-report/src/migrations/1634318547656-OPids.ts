import {MigrationInterface, QueryRunner} from "typeorm";

export class OPids1634318547656 implements MigrationInterface {
    name = 'OPids1634318547656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight_report" ADD "owner_id" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."flight_report" ADD "pilot_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight_report" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."flight_report" DROP COLUMN "owner_id"`);
    }

}
