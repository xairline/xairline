import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Plane } from '../plane.entity';
import {
  XAA_ID,
  SupportedAircrafts,
  XPlaneData,
} from '@xairline/shared-xplane-data';

export class Init1632707968745 implements MigrationInterface {
  name = 'Init1632707968745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plane" ("id" SERIAL NOT NULL, "aircraft_type" character varying NOT NULL, "listed_price" numeric, "lifespan" numeric NOT NULL, "status" text NOT NULL, "owned_by" uuid NOT NULL, "leased_by" uuid, "last_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c7a759d7e8723c8c1a79d52a63a" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "plane"`);
  }
}
