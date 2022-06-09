import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { UpdateTravelerDto } from './dto/update-traveler.dto';
import { TravelerEntity } from './entity/traveler.entity';

@Injectable()
export class TravelerService {
  constructor(
    @InjectRepository(TravelerEntity)
    private readonly travelerRepository: Repository<TravelerEntity>,
  ) {}

  async create(createTravelerDto: CreateTravelerDto): Promise<TravelerEntity> {
    const traveler = this.travelerRepository.create(createTravelerDto);
    const newTraveler = await this.travelerRepository
      .save(traveler)
      .catch(() => {
        throw new BadRequestException('error in database');
      });
    return newTraveler;
  }

  async findAll(): Promise<TravelerEntity[]> {
    return this.travelerRepository.find();
  }

  async findOne(id: number): Promise<TravelerEntity> {
    const traveler = await this.travelerRepository.findOne(id);
    if (!traveler) throw new NotFoundException('The traveler does not exist');
    return traveler;
  }

  async update(
    id: number,
    updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    const updateTraveler = Object.assign(traveler, updateTravelerDto);
    return this.travelerRepository.save(updateTraveler);
  }

  async remove(id: number): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    return this.travelerRepository.remove(traveler);
  }
}
