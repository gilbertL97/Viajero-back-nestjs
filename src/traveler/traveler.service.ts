import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorService } from 'src/contractor/contractor.service';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryService } from 'src/country/country.service';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageService } from 'src/coverage/coverage.service';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
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
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.travelerRepository.find({
      relations: ['coverage', 'contractor', 'origin_country', 'nationality'],
    });
  }

  async findOne(id: string): Promise<TravelerEntity> {
    const traveler = await this.travelerRepository.findOne({
      where: { id: id },
      relations: ['coverage', 'contractor', 'origin_country', 'nationality'],
    });
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    if (!traveler) throw new NotFoundException('The traveler does not exist');
    return traveler;
  }

  async update(
    id: string,
    updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    const updateTraveler = Object.assign(traveler, updateTravelerDto);
    const coverage = await this.coverageService.getCoverage(
      updateTraveler.coverage,
    );
    return this.travelerRepository.updateTraveler(updateTraveler, coverage);
  }

  async remove(id: string): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    return this.travelerRepository.remove(traveler);
  }
  async findOneTravelerWithCoverage(
    coverage: CoverageEntity,
  ): Promise<TravelerEntity> {
    const traveler =
      this.travelerRepository.finOneTravelerWithCoverage(coverage);
    if (!traveler) throw new BadRequestException('The traveler does not exist');
    return traveler;
  }
  async findOneTravelerWithContractor(
    contractor: ContratorEntity,
  ): Promise<TravelerEntity> {
    const traveler =
      this.travelerRepository.finOneTravelerWithContractor(contractor);
    if (!traveler) throw new BadRequestException('The traveler does not exist');
    return traveler;
  }
}
