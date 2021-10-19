import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Airline } from './airline.entity';

@Injectable()
export class AirlineService extends TypeOrmCrudService<Airline> {
  constructor(@InjectRepository(Airline) repo) {
    super(repo);
  }

  public async createAirline(Airline: Airline) {
    return await this.repo.save(Airline);
  }
}
