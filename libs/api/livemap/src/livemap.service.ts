import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Livemap } from './livemap.entity';

@Injectable()
export class LivemapService extends TypeOrmCrudService<Livemap> {
  constructor(@InjectRepository(Livemap, 'db2') repo) {
    super(repo);
  }
  public getRepo(): Repository<Livemap> {
    return this.repo;
  }
}
