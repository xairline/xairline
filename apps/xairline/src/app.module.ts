import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Airline,
  AirlineModule,
  GetAirlineMigrations,
} from '@xairline/electron-airline';
import { app } from 'electron';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: `${app.getPath('appData')}/xairline.sqlite`,
      synchronize: false,
      logging: false,
      migrationsRun: true,
      migrations: [...GetAirlineMigrations()],
      entities: [Airline],
    }),

    AirlineModule,
  ],
})
export class AppModule {}
