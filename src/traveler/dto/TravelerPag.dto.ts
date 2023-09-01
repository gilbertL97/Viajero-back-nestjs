import { ApiProperty } from '@nestjs/swagger';
import { TravelerEntity } from '../entity/traveler.entity';
import { CreateTravelerDto } from './create-traveler.dto';

export class TravelerAndTotal {
  constructor(traveler: TravelerEntity[], total: number) {
    this.travelers = traveler;
    this.total = total;
  }
  @ApiProperty({
    description: 'Lista de Viajeros',
    type: [CreateTravelerDto],
  })
  travelers: TravelerEntity[];
  @ApiProperty({
    description: 'Cantidad Total de Viajeros',
    example: 200,
  })
  total: number;
}
