import { TravelerEntity } from '../entity/traveler.entity';

export class TravelerAndTotal {
  constructor(traveler: TravelerEntity[], total: number) {
    this.travelers = traveler;
    this.total = total;
  }
  travelers: TravelerEntity[];
  total: number;
}
