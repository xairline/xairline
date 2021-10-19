import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerController } from './controllers/passenger.controller';
import { PassengerSummaryController } from './controllers/passenger.summary.controller';
import { Passenger } from './passenger.entity';
import { PassengerService } from './passenger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger], 'db2')],
  controllers: [PassengerController, PassengerSummaryController],
  providers: [PassengerService],
  exports: [PassengerService],
})
export class PassengerModule {}
