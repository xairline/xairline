import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1633113932513 implements MigrationInterface {
    name = 'Init1633113932513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "livemap" ("id" SERIAL NOT NULL, "flight_number" character varying NOT NULL, "airline" character varying NOT NULL, "latitude" numeric NOT NULL, "longitude" numeric NOT NULL, "route" character varying NOT NULL, CONSTRAINT "PK_4e69e14def8e700ae67c73636ef" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "livemap"`);
    }

}
