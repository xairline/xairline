import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1634262174747 implements MigrationInterface {
    name = 'Init1634262174747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flight" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "departure" character varying NOT NULL, "arrival" character varying NOT NULL, "aircraft" character varying NOT NULL, "estimated_flight_time" integer NOT NULL, "actual_flight_time" integer, "bookable" boolean, "owner_id" character varying NOT NULL, "pilot_id" character varying NOT NULL, "lastUpdate" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_bf571ce6731cf071fc51b94df03" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "flight"`);
    }

}
