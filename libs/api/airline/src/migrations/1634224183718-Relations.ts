import {MigrationInterface, QueryRunner} from "typeorm";

export class Relations1634224183718 implements MigrationInterface {
    name = 'Relations1634224183718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_f84f64f4037f86b989d6d153cfd"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_bb6f72ca6465d1f702d0d7d7c56"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "REL_bb6f72ca6465d1f702d0d7d7c5"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "REL_f84f64f4037f86b989d6d153cf"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilotId"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "owner_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "UQ_7696c8071f74fe2b5cb48e22a55" UNIQUE ("owner_id")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilot_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "UQ_8c91330e8fa32808679dbfc1b91" UNIQUE ("pilot_id")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_7696c8071f74fe2b5cb48e22a55" FOREIGN KEY ("owner_id") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_8c91330e8fa32808679dbfc1b91" FOREIGN KEY ("pilot_id") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_8c91330e8fa32808679dbfc1b91"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "FK_7696c8071f74fe2b5cb48e22a55"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "UQ_8c91330e8fa32808679dbfc1b91"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "pilot_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilot_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP CONSTRAINT "UQ_7696c8071f74fe2b5cb48e22a55"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "owner_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "pilotId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "REL_f84f64f4037f86b989d6d153cf" UNIQUE ("pilotId")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "REL_bb6f72ca6465d1f702d0d7d7c5" UNIQUE ("ownerId")`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_bb6f72ca6465d1f702d0d7d7c56" FOREIGN KEY ("ownerId") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."airline_to_airline_relation" ADD CONSTRAINT "FK_f84f64f4037f86b989d6d153cfd" FOREIGN KEY ("pilotId") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
