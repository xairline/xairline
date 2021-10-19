import {MigrationInterface, QueryRunner} from "typeorm";

export class Callsign1634053783454 implements MigrationInterface {
    name = 'Callsign1634053783454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_airline"("id", "name") SELECT "id", "name" FROM "airline"`);
        await queryRunner.query(`DROP TABLE "airline"`);
        await queryRunner.query(`ALTER TABLE "temporary_airline" RENAME TO "airline"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airline" RENAME TO "temporary_airline"`);
        await queryRunner.query(`CREATE TABLE "airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "callsign" varchar, "cash" integer NOT NULL DEFAULT (100000000), "profilePic" varchar)`);
        await queryRunner.query(`INSERT INTO "airline"("id", "name") SELECT "id", "name" FROM "temporary_airline"`);
        await queryRunner.query(`DROP TABLE "temporary_airline"`);
    }

}
