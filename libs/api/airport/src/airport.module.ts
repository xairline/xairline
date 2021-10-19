import { Module } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { Airport } from './airport.entity';
import { AirportService } from './airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtendedAirportController } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  controllers: [AirportController, ExtendedAirportController],
  providers: [AirportService],
  exports: [AirportService],
})
export class AirportModule {}
