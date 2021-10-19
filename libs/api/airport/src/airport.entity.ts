import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'airport identifier',
  })
  @Column()
  identifier: string;

  @ApiPropertyOptional({
    description: 'name of airport',
  })
  @Column()
  name?: string;

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
}
