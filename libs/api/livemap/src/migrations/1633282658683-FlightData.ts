import {MigrationInterface, QueryRunner} from "typeorm";

export class FlightData1633282658683 implements MigrationInterface {
    name = 'FlightData1633282658683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."livemap" ADD "flight_data" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."livemap" DROP COLUMN "flight_data"`);
    }

}
