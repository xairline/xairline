import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightReportController } from './flight-report.controller';
import { FlightReport } from './flight-report.entity';
import { FlightReportModule } from './flight-report.module';

describe('FlightReportController', () => {
  let controller: FlightReportController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        FlightReportModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: `tmp/development.sqlite`,
          synchronize: true,
          logging: false,
          entities: [FlightReport],
        }),
      ],
      controllers: [FlightReportController],
    }).compile();

    controller = module.get(FlightReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
