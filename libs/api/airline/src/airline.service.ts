import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Airline, AirlineToAirlineRelation } from './airline.entity';
import * as md5 from 'md5';
@Injectable()
export class AirlineService extends TypeOrmCrudService<Airline> {
  constructor(@InjectRepository(Airline) repo) {
    super(repo);
  }

  async updateCash(id: string, cash: number): Promise<Airline> {
    let res: Airline;
    await this.repo.manager.transaction(async (transactionalEntityManager) => {
      const repo = transactionalEntityManager.getRepository(Airline);
      const airline: Airline = await repo.findOne(id);
      res = await repo.save({
        ...airline,
        cash: parseFloat(`${airline.cash}`) + parseFloat(`${cash}`),
      });
      // ...
    });
    return res;
  }

  async updatePassword(dto: { id: string; password: string }) {
    return this.repo.save({ id: dto.id, password: md5(dto.password) });
  }
}

@Injectable()
export class AirlineRelationsService extends TypeOrmCrudService<AirlineToAirlineRelation> {
  constructor(@InjectRepository(AirlineToAirlineRelation) repo) {
    super(repo);
  }
}
