import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1634778377886 implements MigrationInterface {
    name = 'Init1634778377886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fleet" ("id" SERIAL NOT NULL, "aircraft_type" character varying NOT NULL, "listed_price" numeric, "pax_capacity" integer array NOT NULL, "cargo_capacity" integer NOT NULL, "status" text NOT NULL, "owner_id" uuid NOT NULL, "condition" integer NOT NULL, "last_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_17e0760d2492f67c67ce0fe4aa7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fleet"`);
    }

}
