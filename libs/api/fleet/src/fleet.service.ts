import { Injectable } from '@nestjs/common';
import { Fleet } from './fleet.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FleetService extends TypeOrmCrudService<Fleet> {
  constructor(@InjectRepository(Fleet) repo) {
    super(repo);
  }

  getFleetByType(aircraft_type: string) {
    return this.repo.find({ where: { aircraft_type } });
  }
}
