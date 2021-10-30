import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetPlaneMigrations, Plane, PlaneModule } from '@xairline/api-plane';
import {
  LivemapModule,
  Livemap,
  GetLivemapMigrations,
} from '@xairline/api-livemap';
import {
  Airline,
  AirlineModule,
  AirlineToAirlineRelation,
  GetAirlineMigrations,
} from '@xairline/api-airline';
import {
  Flight,
  FlightModule,
  GetFlightMigrations,
} from '@xairline/api-flight';
import {
  FlightReport,
  FlightReportModule,
  GetFlightReportMigrations,
} from '@xairline/api-flight-report';
import { Fleet, FleetModule, GetFleetMigrations } from '@xairline/api-fleet';
import {
  GetPassengerMigrations,
  Passenger,
  PassengerModule,
} from '@xairline/api-passenger';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      extra: {
        ssl: process.env.DATABASE_URL
          ? {
              rejectUnauthorized: false,
            }
          : null,
      },
      logging: true,
      migrationsRun: true,
      migrations: [
        ...GetPlaneMigrations(),
        ...GetAirlineMigrations(),
        //...GetAirportMigrations(),
        ...GetFlightMigrations(),
        ...GetFleetMigrations(),
      ],
      entities: [Plane, Airline, AirlineToAirlineRelation, Flight, Fleet],
    }),
    TypeOrmModule.forRoot({
      name: 'db2',
      type: 'postgres',
      url: process.env.HEROKU_POSTGRESQL_JADE_URL,
      synchronize: false,
      extra: {
        ssl: process.env.HEROKU_POSTGRESQL_JADE_URL
          ? {
              rejectUnauthorized: false,
            }
          : null,
      },
      logging: true,
      migrationsRun: true,
      migrations: [
        ...GetLivemapMigrations(),
        ...GetFlightReportMigrations(),
        ...GetPassengerMigrations(),
      ],
      entities: [Livemap, FlightReport, Passenger],
    }),

    PlaneModule,
    AirlineModule,
    FlightReportModule,
    PassengerModule,
    //AirportModule,
    LivemapModule,
    FlightModule,
    FleetModule,
  ],
})
export class AppModule {}
