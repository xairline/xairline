import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Flight } from '@xairline/flight';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ example: 'XA-233', description: 'The Flight No.' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'CYOW',
    description: 'The depature airport',
  })
  @Column()
  departure: string;

  @ApiProperty({
    example: 'CYOW',
    description: 'The arrival airport',
  })
  @Column()
  arrival: string;

  @ApiProperty({
    example: 'B738',
    description: 'The type of aircraft',
  })
  @Column()
  aircraft: string;

  @ApiProperty({
    example: 150,
    description: 'estimated flight time',
  })
  @Column({ nullable: true, default: 0.0, type: 'decimal' })
  estimated_flight_time: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'actual flight time',
    nullable: true,
  })
  @Column({ nullable: true, default: 0.0, type: 'decimal' })
  actual_flight_time?: number;

  @ApiProperty({
    example: false,
    description: 'if a flight can be booked',
    nullable: true,
  })
  @Column({ nullable: true })
  bookable: boolean;

  @ApiProperty({
    example: false,
  })
  @Column()
  owner_id: string;

  @ApiProperty({
    example: false,
  })
  @Column()
  pilot_id: string;

  @UpdateDateColumn({ nullable: true })
  lastUpdate?: Date;
}
