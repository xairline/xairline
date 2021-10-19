import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1632590918407 implements MigrationInterface {
    name = 'Init1632590918407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "airline" ("id" uuid NOT NULL, "name" character varying NOT NULL, "cash" integer NOT NULL DEFAULT '100000000', "langding_vs" integer, "landing_g" integer NOT NULL DEFAULT '0', "total_flights" integer NOT NULL DEFAULT '0', "total_violations" integer NOT NULL DEFAULT '0', "total_hours" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_9a0dd52135c26e0201205412623" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "airline"`);
    }

}
