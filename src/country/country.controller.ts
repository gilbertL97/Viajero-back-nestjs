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
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/user/user.role';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryEntity } from './entities/country.entity';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
@ApiBearerAuth('access-token')
@Controller('country')
@ApiTags('Paises')
@UseGuards(JwtAuthGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
  @ApiExcludeEndpoint()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryEntity> {
    const data = await this.countryService.create(createCountryDto);
    return data;
  }
  @ApiOkResponse({
    description: 'Devuelve una lista de paises',
    type: CreateCountryDto,
  })
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
  @ApiOkResponse({
    type: CreateCountryDto,
  })
  @ApiParam({
    description:
      'recibe un ISO de 3 caracteres y devuelve todos los datos del pais',
    type: 'string',
    name: 'id',
    example: 'CUB',
  })
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
  @ApiExcludeEndpoint()
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
  @ApiExcludeEndpoint()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<CountryEntity> {
    const iso = id.toLocaleUpperCase();
    const data = await this.countryService.remove(iso);
    return data;
  }
}
