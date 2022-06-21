import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryEntity> {
    const data = await this.countryService.create(createCountryDto);
    return data;
  }

  @Get()
  async getCountries(): Promise<CountryEntity[]> {
    const data = await this.countryService.findAll();
    return data;
  }

  @Get(':id')
  async getCountry(@Param('id') id: string): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.findOne(iso);
    return data;
  }

  @Patch(':id')
  async updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.update(id, updateCountryDto);
    return data;
  }

  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.remove(id);
    return data;
  }
}
