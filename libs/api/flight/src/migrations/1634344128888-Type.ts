import {MigrationInterface, QueryRunner} from "typeorm";

export class Type1634344128888 implements MigrationInterface {
    name = 'Type1634344128888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "estimated_flight_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "estimated_flight_time" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "actual_flight_time" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "actual_flight_time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "estimated_flight_time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."flight" ALTER COLUMN "estimated_flight_time" SET NOT NULL`);
    }

}
