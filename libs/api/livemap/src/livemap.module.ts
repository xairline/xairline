import { Module } from '@nestjs/common';
import { LivemapController } from './livemap.controller';
import { Livemap } from './livemap.entity';
import { LivemapService } from './livemap.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Livemap], 'db2')],
  controllers: [LivemapController],
  providers: [LivemapService],
  exports: [TypeOrmModule],
})
export class LivemapModule {}
