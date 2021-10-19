import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1634267051581 implements MigrationInterface {
    name = 'Init1634267051581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passenger" ("id" integer NOT NULL, "total_number_of_passengers" integer NOT NULL, "delayed_flight_penalty_20" integer NOT NULL, "delayed_flight_penalty_60" integer NOT NULL, "delayed_flight_penalty_120" integer NOT NULL, "landing_g_force_penalty_1_5" integer NOT NULL, "landing_g_force_penalty_2_0" integer NOT NULL, "landing_g_force_penalty_2_5" integer NOT NULL, "landing_vs_penalty_1_5" integer NOT NULL, "landing_vs_penalty_2_5" integer NOT NULL, "landing_vs_penalty_3_0" integer NOT NULL, "satisfication" integer DEFAULT '100', "aircraft_type" character varying, "airline_id" character varying, CONSTRAINT "PK_50e940dd2c126adc20205e83fac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "passenger"`);
    }

}
