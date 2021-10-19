import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plane {
  @ApiPropertyOptional({
    description: 'id of a plane',
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'type of a plane',
  })
  @Column()
  aircraft_type: string;

  @ApiPropertyOptional({
    description: 'listed price',
  })
  @Column({ type: 'decimal', nullable: true })
  listed_price?: number;

  @ApiProperty({
    description: 'capacity of plane',
  })
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'status of a plane',
  })
  @Column({ type: 'text' })
  status: 'listed' | 'in_flight' | 'normal' | 'sold';

  @ApiProperty({
    description: 'owner airline information of a plane',
  })
  @Column({ type: 'uuid' })
  owned_by: string;

  @ApiPropertyOptional({
    description: 'leased airline information',
  })
  @Column({ type: 'uuid', nullable: true })
  leased_by?: string;

  @ApiPropertyOptional({
    description: 'last updated timestamp',
  })
  @UpdateDateColumn()
  last_update?: Date;
}
