import {MigrationInterface, QueryRunner} from "typeorm";

export class Callsign1632966261082 implements MigrationInterface {
    name = 'Callsign1632966261082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "callsign" varchar, "cash" integer NOT NULL DEFAULT (100000000))`);
        await queryRunner.query(`INSERT INTO "temporary_airline"("id", "name", "callsign", "cash") SELECT "id", "name", "bin_id", "cash" FROM "airline"`);
        await queryRunner.query(`DROP TABLE "airline"`);
        await queryRunner.query(`ALTER TABLE "temporary_airline" RENAME TO "airline"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airline" RENAME TO "temporary_airline"`);
        await queryRunner.query(`CREATE TABLE "airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "bin_id" varchar, "cash" integer NOT NULL DEFAULT (100000000))`);
        await queryRunner.query(`INSERT INTO "airline"("id", "name", "bin_id", "cash") SELECT "id", "name", "callsign", "cash" FROM "temporary_airline"`);
        await queryRunner.query(`DROP TABLE "temporary_airline"`);
    }

}
