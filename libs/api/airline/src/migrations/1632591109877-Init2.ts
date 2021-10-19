import {MigrationInterface, QueryRunner} from "typeorm";

export class Init21632591109877 implements MigrationInterface {
    name = 'Init21632591109877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "lastUpdate" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "lastUpdate"`);
    }

}
