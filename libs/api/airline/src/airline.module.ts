import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AirlineControllerV2,
  AirlineRelationsController,
} from './airline.controller';
import { Airline, AirlineToAirlineRelation } from './airline.entity';
import { AirlineRelationsService, AirlineService } from './airline.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@xairline/shared-rest-util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airline, AirlineToAirlineRelation]),
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'ofcIDoNotUseThisOnProductio' }),
  ],
  controllers: [AirlineControllerV2, AirlineRelationsController],
  providers: [AirlineService, JwtStrategy, AirlineRelationsService],
  exports: [AirlineService, AirlineRelationsService],
})
export class AirlineModule {}
