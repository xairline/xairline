import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Profile } from 'passport';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class Airline {
  @ApiPropertyOptional({ description: 'The id of an Airline', type: String })
  @PrimaryColumn('uuid')
  id?: string;

  @ApiProperty({ example: 'Alpha', description: 'The name of an Airline' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'callsign',
  })
  @Column({ default: 'XA' })
  callsign: string;

  @ApiProperty({
    example: '300000000',
    description: 'Cash of your airline',
  })
  @Column({ default: 300000000.0, type: 'decimal' })
  cash: number;

  @ApiProperty({
    description: 'Cash of your airline',
  })
  @Column({ default: 0.0, type: 'decimal' })
  landing_vs: number;

  @ApiProperty({
    description: 'avg landing g force',
  })
  @Column({ default: 0.0, type: 'decimal' })
  landing_g: number;

  @ApiProperty({
    description: 'total number of flights',
  })
  @Column({ default: 0 })
  total_flights: number;

  @ApiProperty({
    description: 'total number of violations',
  })
  @Column({ default: 0 })
  total_violations: number;

  @ApiProperty({
    description: 'total number of hours',
  })
  @Column({ default: 0.0, type: 'decimal' })
  total_hours: number;

  @ApiPropertyOptional({
    description: 'profile picture',
  })
  @Column({ nullable: true })
  profilePic?: string;

  @ApiPropertyOptional({
    description: 'total number of hours',
    type: Date,
  })
  @UpdateDateColumn({ nullable: true })
  lastUpdate?: Date;

  @ApiPropertyOptional({
    description: 'email',
    writeOnly: true,
  })
  @Column({ nullable: true })
  email?: string;

  @ApiPropertyOptional({
    description: 'password',
    writeOnly: true,
  })
  @Column({ nullable: true })
  password?: string;
}

@Entity()
export class AirlineToAirlineRelation {
  @ApiPropertyOptional({
    description: 'The id of an AirlineToAirlineRelation',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'some id', description: 'owner_id' })
  @Column()
  owner_id: string;

  @ApiProperty({ example: 'some id', description: 'pilot_id' })
  @Column()
  pilot_id: string;

  @ApiProperty({ example: 'approved', description: 'status of a pilot' })
  @Column()
  status: string;
}
