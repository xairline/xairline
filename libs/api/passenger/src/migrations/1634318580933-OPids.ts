import {MigrationInterface, QueryRunner} from "typeorm";

export class OPids1634318580933 implements MigrationInterface {
    name = 'OPids1634318580933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "owner_id" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "pilot_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "owner_id"`);
    }

}
