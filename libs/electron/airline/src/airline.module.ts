import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineController } from './airline.controller';
import { Airline } from './airline.entity';
import { AirlineService } from './airline.service';

@Module({
  imports: [TypeOrmModule.forFeature([Airline])],
  controllers: [AirlineController],
  providers: [AirlineService],
  exports: [AirlineService],
})
export class AirlineModule {}
