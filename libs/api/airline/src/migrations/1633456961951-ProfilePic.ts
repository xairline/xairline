import {MigrationInterface, QueryRunner} from "typeorm";

export class ProfilePic1633456961951 implements MigrationInterface {
    name = 'ProfilePic1633456961951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" ADD "profilePic" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."airline" DROP COLUMN "profilePic"`);
    }

}
