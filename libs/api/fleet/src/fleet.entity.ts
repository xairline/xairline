import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Fleet {
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
    description: 'pax capacity of plane',
    isArray: true,
  })
  @Column('int', { array: true })
  pax_capacity: number[];

  @ApiProperty({
    description: 'cargo capacity of plane',
  })
  @Column()
  cargo_capacity: number;

  @ApiProperty({
    description: 'status of a plane',
  })
  @Column({ type: 'text' })
  status: 'listed' | 'in_flight' | 'normal' | 'sold';

  @ApiProperty({
    description: 'owner airline information of a plane',
  })
  @Column({ type: 'uuid' })
  owner_id: string;

  @ApiProperty({
    description: 'condition of plane',
  })
  @Column()
  condition: number;

  @ApiPropertyOptional({
    description: 'last updated timestamp',
  })
  @UpdateDateColumn()
  last_update?: Date;
}
