import {
  MigrationInterface,
  QueryRunner,
  getRepository,
  DeepPartial,
} from 'typeorm';
import { XAA_ID } from '@xairline/shared-xplane-data';
import { Airline } from '..';
export class Seed21632629394459 implements MigrationInterface {
  name = 'Seed21632629394459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Airline).save({
      id: XAA_ID,
      name: 'XAA',
      cash: 99999999999,
      landing_vs: 0,
      landing_g: 0,
      total_flights: 0,
      total_violations: 0,
      total_hours: 0,
      lastUpdate: '2021-09-26T17:24:59.985Z',
    } as DeepPartial<Airline>);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
