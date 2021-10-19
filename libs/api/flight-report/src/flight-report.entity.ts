import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FlightReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123', description: 'The Flight id' })
  @Column()
  flight_id: string;

  @ApiProperty({
    description: 'flight events: stringified json array',
  })
  @Column()
  events: string; // sqlite doesn't support array type

  @ApiProperty({
    description: 'flight violation events: stringified json array',
  })
  @Column()
  violation_events: string; // sqlite doesn't support array type

  @ApiProperty({
    description: 'landing data',
  })
  @Column()
  landingData: string;

  @ApiProperty({
    description: 'json array to store costs, stringified in database',
  })
  @Column({ nullable: true })
  cost: string;

  @ApiPropertyOptional({
    example: "some id",
  })
  @Column({nullable: true})
  owner_id?: string;

  @ApiPropertyOptional({
    example: "some id",
  })
  @Column({nullable: true})
  pilot_id?: string;

  @UpdateDateColumn()
  lastUpdate: Date;
}
