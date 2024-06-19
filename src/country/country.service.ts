import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';
import { Configuration } from 'src/config/config.const';
import { LogginService } from 'src/loggin/loggin.service';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity, Configuration.POSTGRESCONNECT)
    private readonly countryRepository: Repository<CountryEntity>,
    private readonly loggingService: LogginService,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<CountryEntity> {
    const country = this.countryRepository.create(createCountryDto);
    this.loggingService.create({
      message: `Creando pais: ${createCountryDto.nombre_comun}`,
      context: 'Country Service',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return await this.countryRepository.save(country);
  }

  async findAll(): Promise<CountryEntity[]> {
    this.loggingService.create({
      message: `Obtendiendo todos los paises`,
      context: 'Country Service',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return await this.countryRepository.find();
  }

  async findOne(id: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({
      where: { iso: id },
    });
    if (!country) throw new NotFoundException('the country does not exist');
    this.loggingService.create({
      message: `Buscando pais con iso: ${id}`,
      context: 'Country Service',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<CountryEntity> {
    const updateCountry = await this.findOne(id);
    const country = Object.assign(updateCountry, updateCountryDto);
    this.loggingService.create({
      message: `Actualizando pais: ${updateCountryDto.nombre_comun}`,
      context: 'Country Service',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return this.countryRepository.save(country);
  }

  async remove(id: string): Promise<CountryEntity> {
    const country = await this.findOne(id);
    this.loggingService.create({
      message: `Eliminando pais: ${id}`,
      context: 'Country Service',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    return this.countryRepository.remove(country);
  }
}
