import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorService } from 'src/contractor/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageService } from 'src/coverage/coverage.service';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { UpdateTravelerDto } from './dto/update-traveler.dto';
import { TravelerEntity } from './entity/traveler.entity';
import { TravelerRepository } from './traveler.repository';

@Injectable()
export class TravelerService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
  ) {}

  async create(createTravelerDto: CreateTravelerDto): Promise<TravelerEntity> {
    let nationality: CountryEntity;
    if (createTravelerDto.nationality)
      nationality = await this.countryService.findOne(
        createTravelerDto.nationality,
      );
    let origin_country: CountryEntity;
    if (createTravelerDto.origin_country)
      origin_country = await this.countryService.findOne(
        createTravelerDto.origin_country,
      );
    const contractor = await this.contratctoService.getContractor(
      +createTravelerDto.contractor,
    );
    const coverage = await this.coverageService.getCoverage(
      +createTravelerDto.coverage,
    );

    const traveler = await this.travelerRepository.createTraveler(
      createTravelerDto,
      coverage,
      contractor,
      nationality,
      origin_country,
    );
    return traveler;
  }

  async findAll(): Promise<TravelerEntity[]> {
    return this.travelerRepository.find();
  }

  async findOne(id: string): Promise<TravelerEntity> {
    const traveler = await this.travelerRepository.findOne(id);
    if (!traveler) throw new NotFoundException('The traveler does not exist');
    return traveler;
  }

  async update(
    id: string,
    updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    const updateTraveler = Object.assign(traveler, updateTravelerDto);
    return this.travelerRepository.save(updateTraveler);
  }

  async remove(id: string): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    return this.travelerRepository.remove(traveler);
  }
}
