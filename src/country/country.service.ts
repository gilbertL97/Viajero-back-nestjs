import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';
import { Configuration } from 'src/config/config.const';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity, Configuration.POSTGRESCONNECT)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const country = this.countryRepository.create(createCountryDto);
    return await this.countryRepository.save(country);
  }

  async findAll(): Promise<CountryEntity[]> {
    return await this.countryRepository.find();
  }

  async findOne(id: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({
      where: { iso: id },
    });
    if (!country) throw new NotFoundException('the country does not exist');
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<CountryEntity> {
    const updateCountry = await this.findOne(id);
    const country = Object.assign(updateCountry, updateCountryDto);
    return this.countryRepository.save(country);
  }

  async remove(id: string): Promise<CountryEntity> {
    const country = await this.findOne(id);
    return this.countryRepository.remove(country);
  }
}
