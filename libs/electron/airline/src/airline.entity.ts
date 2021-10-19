import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Flight } from '@xairline/flight';

@Entity()
export class Airline {
  @ApiPropertyOptional({ description: 'The id of an Airline', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Alpha', description: 'The name of an Airline' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Alpha', description: 'The machine id of a client' })
  @Column()
  machine_id: string;
}
