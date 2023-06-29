import { TravelerEntity } from '../entity/traveler.entity';

export class TravelerAndTotal {
  constructor(traveler: TravelerEntity[], total: number) {
    this.traveler = traveler;
    this.total = total;
  }
  traveler: TravelerEntity[];
  total: number;
}
