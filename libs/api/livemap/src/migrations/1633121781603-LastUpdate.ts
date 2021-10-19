import {MigrationInterface, QueryRunner} from "typeorm";

export class LastUpdate1633121781603 implements MigrationInterface {
    name = 'LastUpdate1633121781603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."livemap" ADD "lastUpdate" TIMESTAMP DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."livemap" DROP COLUMN "lastUpdate"`);
    }

}
