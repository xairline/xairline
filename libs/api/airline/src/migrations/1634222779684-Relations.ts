import {MigrationInterface, QueryRunner} from "typeorm";

export class Relations1634222779684 implements MigrationInterface {
    name = 'Relations1634222779684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "airline_to_airline_relation" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "ownerId" uuid, "pilotId" uuid, CONSTRAINT "REL_bb6f72ca6465d1f702d0d7d7c5" UNIQUE ("ownerId"), CONSTRAINT "REL_f84f64f4037f86b989d6d153cf" UNIQUE ("pilotId"), CONSTRAINT "PK_79d2215c710c7458bd233fa80e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "airline_to_airline_relation" ADD CONSTRAINT "FK_bb6f72ca6465d1f702d0d7d7c56" FOREIGN KEY ("ownerId") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airline_to_airline_relation" ADD CONSTRAINT "FK_f84f64f4037f86b989d6d153cfd" FOREIGN KEY ("pilotId") REFERENCES "airline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airline_to_airline_relation" DROP CONSTRAINT "FK_f84f64f4037f86b989d6d153cfd"`);
        await queryRunner.query(`ALTER TABLE "airline_to_airline_relation" DROP CONSTRAINT "FK_bb6f72ca6465d1f702d0d7d7c56"`);
        await queryRunner.query(`DROP TABLE "airline_to_airline_relation"`);
    }

}
