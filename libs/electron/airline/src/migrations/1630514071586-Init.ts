import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1630514071586 implements MigrationInterface {
  name = 'Init1630514071586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "airline" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "base" varchar)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "airline"`);
  }
}
