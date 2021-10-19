import {MigrationInterface, QueryRunner} from "typeorm";

export class Relations1634223991804 implements MigrationInterface {
    name = 'Relations1634223991804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "owner_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilot_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "owner_id"`);
    }

}
