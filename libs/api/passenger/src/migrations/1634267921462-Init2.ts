import {MigrationInterface, QueryRunner} from "typeorm";

export class Init21634267921462 implements MigrationInterface {
    name = 'Init21634267921462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_20"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_20" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_60"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_60" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_120"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_120" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_1_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_1_5" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_2_0"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_2_0" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_2_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_2_5" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_1_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_1_5" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_2_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_2_5" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_3_0"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_3_0" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "satisfication"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "satisfication" numeric DEFAULT '100'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "satisfication"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "satisfication" integer DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_3_0"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_3_0" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_2_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_2_5" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_vs_penalty_1_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_vs_penalty_1_5" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_2_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_2_5" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_2_0"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_2_0" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "landing_g_force_penalty_1_5"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "landing_g_force_penalty_1_5" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_120"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_120" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_60"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_60" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" DROP COLUMN "delayed_flight_penalty_20"`);
        await queryRunner.query(`ALTER TABLE "public"."passenger" ADD "delayed_flight_penalty_20" integer NOT NULL`);
    }

}
