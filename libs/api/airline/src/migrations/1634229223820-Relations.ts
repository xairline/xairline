import {MigrationInterface, QueryRunner} from "typeorm";

export class Relations1634229223820 implements MigrationInterface {
    name = 'Relations1634229223820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_8c91330e8fa32808679dbfc1b91"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_7696c8071f74fe2b5cb48e22a55"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "UQ_7696c8071f74fe2b5cb48e22a55"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "owner_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "UQ_8c91330e8fa32808679dbfc1b91"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilot_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilot_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "UQ_8c91330e8fa32808679dbfc1b91" UNIQUE ("pilot_id")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "owner_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "UQ_7696c8071f74fe2b5cb48e22a55" UNIQUE ("owner_id")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_7696c8071f74fe2b5cb48e22a55" FOREIGN KEY ("owner_id") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_8c91330e8fa32808679dbfc1b91" FOREIGN KEY ("pilot_id") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
