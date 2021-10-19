import { MigrationInterface, QueryRunner } from 'typeorm';
import { machineId } from 'node-machine-id';
export class MachineId1634133233288 implements MigrationInterface {
  name = 'MachineId1634133233288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const machine_id = await machineId();
    await queryRunner.query(
      `CREATE TABLE "temporary_airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "machine_id" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_airline"("id", "name", "machine_id") SELECT "id", "name", '${machine_id}' FROM "airline"`
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
      `CREATE TABLE "airline" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "airline"("id", "name") SELECT "id", "name" FROM "temporary_airline"`
    );
    await queryRunner.query(`DROP TABLE "temporary_airline"`);
  }
}
