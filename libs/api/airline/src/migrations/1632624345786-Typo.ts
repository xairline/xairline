import {MigrationInterface, QueryRunner} from "typeorm";

export class Typo1632624345786 implements MigrationInterface {
    name = 'Typo1632624345786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" RENAME COLUMN "langding_vs" TO "landing_vs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" RENAME COLUMN "landing_vs" TO "langding_vs"`);
    }

}
