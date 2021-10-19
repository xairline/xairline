import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Passenger {
  @ApiProperty({ example: '123', description: 'The Flight id' })
  @PrimaryColumn()
  id: number;

  @ApiPropertyOptional()
  @Column({ type: 'int' })
  total_number_of_passengers: number;

  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  delayed_flight_penalty_20: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  delayed_flight_penalty_60: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  delayed_flight_penalty_120: number;

  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_g_force_penalty_1_5: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_g_force_penalty_2_0: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_g_force_penalty_2_5: number;

  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_vs_penalty_1_5: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_vs_penalty_2_5: number;
  @ApiPropertyOptional()
  @Column({ type: 'decimal' })
  landing_vs_penalty_3_0: number;

  @ApiPropertyOptional()
  @Column({ nullable: true, default: 100, type: 'decimal' })
  satisfication: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  aircraft_type: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  airline_id: string;

  @ApiPropertyOptional({
    example: "some id",
  })
  @Column({ nullable: true })
  owner_id?: string;

  @ApiPropertyOptional({
    example: "some id",
  })
  @Column({ nullable: true })
  pilot_id?: string;
}
