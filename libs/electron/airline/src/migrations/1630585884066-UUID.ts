import { MigrationInterface, QueryRunner } from 'typeorm';

export class UUID1630585884066 implements MigrationInterface {
  name = 'UUID1630585884066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_airline" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "base" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_airline"("id", "name", "base") SELECT "id", "name", "base" FROM "airline"`
    );
    await queryRunner.query(`DROP TABLE "airline"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_airline" RENAME TO "airline"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "base" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_airline"("id", "name", "base") SELECT "id", "name", "base" FROM "airline"`
    );
    await queryRunner.query(`DROP TABLE "airline"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_airline" RENAME TO "airline"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "airline" RENAME TO "temporary_airline"`
    );
    await queryRunner.query(
      `CREATE TABLE "airline" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "base" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "airline"("id", "name", "base") SELECT "id", "name", "base" FROM "temporary_airline"`
    );
    await queryRunner.query(`DROP TABLE "temporary_airline"`);
    await queryRunner.query(
      `ALTER TABLE "airline" RENAME TO "temporary_airline"`
    );
    await queryRunner.query(
      `CREATE TABLE "airline" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "base" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "airline"("id", "name", "base") SELECT "id", "name", "base" FROM "temporary_airline"`
    );
    await queryRunner.query(`DROP TABLE "temporary_airline"`);
  }
}
