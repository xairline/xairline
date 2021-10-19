import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FlightReportController,
  FlightReportSummaryController,
} from './flight-report.controller';
import { FlightReport } from './flight-report.entity';
import { FlightReportService } from './flight-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlightReport], 'db2')],
  controllers: [FlightReportController, FlightReportSummaryController],
  providers: [FlightReportService],
  exports: [FlightReportService],
})
export class FlightReportModule {}
