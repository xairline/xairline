import {MigrationInterface, QueryRunner} from "typeorm";

export class Capacity1634052784726 implements MigrationInterface {
    name = 'Capacity1634052784726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."plane" RENAME COLUMN "lifespan" TO "capacity"`);
        await queryRunner.query(`ALTER TABLE "public"."plane" DROP COLUMN "capacity"`);
        await queryRunner.query(`ALTER TABLE "public"."plane" ADD "capacity" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."plane" DROP COLUMN "capacity"`);
        await queryRunner.query(`ALTER TABLE "public"."plane" ADD "capacity" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."plane" RENAME COLUMN "capacity" TO "lifespan"`);
    }

}
