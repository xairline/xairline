import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Plane } from './plane.entity';

@Injectable()
export class PlaneService extends TypeOrmCrudService<Plane> {
  constructor(@InjectRepository(Plane) repo) {
    super(repo);
  }
}
