import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1634266786905 implements MigrationInterface {
    name = 'Init1634266786905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flight_report" ("id" SERIAL NOT NULL, "flight_id" character varying NOT NULL, "events" character varying NOT NULL, "violation_events" character varying NOT NULL, "landingData" character varying NOT NULL, "cost" character varying, "lastUpdate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96f9ba518792edf60ed693614a5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "flight_report"`);
    }

}
