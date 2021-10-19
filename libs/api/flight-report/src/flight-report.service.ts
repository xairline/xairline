import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FlightReport } from './flight-report.entity';

@Injectable()
export class FlightReportService extends TypeOrmCrudService<FlightReport> {
  constructor(@InjectRepository(FlightReport, 'db2') repo) {
    super(repo);
  }
}
