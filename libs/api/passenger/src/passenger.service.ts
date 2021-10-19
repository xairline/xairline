import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Passenger } from './passenger.entity';

@Injectable()
export class PassengerService extends TypeOrmCrudService<Passenger> {
  constructor(@InjectRepository(Passenger, 'db2') repo) {
    super(repo);
  }
}
