import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/user/user.role';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryEntity> {
    const data = await this.countryService.create(createCountryDto);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get()
  async getCountries(): Promise<CountryEntity[]> {
    const data = await this.countryService.findAll();
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get(':id')
  async getCountry(@Param('id') id: string): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.findOne(iso);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.update(iso, updateCountryDto);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.remove(iso);
    return data;
  }
}
