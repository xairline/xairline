import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Livemap {
  @ApiPropertyOptional({
    description: 'flight number',
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'flight number',
  })
  @Column()
  flight_number: string;

  @ApiProperty({
    description: 'name of airline',
  })
  @Column()
  airline: string;

  @ApiProperty({
    description: 'latitude',
  })
  @Column({ type: 'decimal' })
  latitude: number;

  @ApiProperty({
    description: 'longitude',
  })
  @Column({ type: 'decimal' })
  longitude: number;

  @ApiProperty({
    description: 'longitude',
  })
  @Column()
  route: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  flight_data?: string;

  @UpdateDateColumn({ nullable: true })
  lastUpdate?: Date;
}
