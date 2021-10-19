import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Airport } from './airport.entity';

@Injectable()
export class AirportService extends TypeOrmCrudService<Airport> {
  constructor(@InjectRepository(Airport) repo) {
    super(repo);
  }
  public getRepo(): Repository<Airport> {
    return this.repo;
  }
}
