import { Module } from '@nestjs/common';
import { FleetController } from './fleet.controller';
import { Fleet } from './fleet.entity';
import { FleetService } from './fleet.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Fleet])],
  controllers: [FleetController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
