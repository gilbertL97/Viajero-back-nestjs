import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { exportExcel } from 'src/common/export/exportExcel';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryService } from 'src/country/country.service';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageService } from 'src/coverage/coverage.service';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { UserService } from 'src/user/user.service';
import { CreateTravelerDto } from '../dto/create-traveler.dto';
import { FilterTravelerDto } from '../dto/filter-traveler.dto';
import { UpdateTravelerDto } from '../dto/update-traveler.dto';
import { TravelerEntity } from '../entity/traveler.entity';
import { TravelerRepository } from '../repository/traveler.repository';

@Injectable()
export class TravelerService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
    private readonly userService: UserService,
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

    const traveler = await this.travelerRepository
      .createTraveler(
        createTravelerDto,
        coverage,
        contractor,
        nationality,
        origin_country,
      )
      .catch((error) => {
        if (error.code == 23505)
          throw new BadRequestException('Viajero duplicado');
        throw new BadRequestException('error in database');
      });
    return traveler;
  }

  async findAll(user: UserEntity): Promise<TravelerEntity[]> {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    if (user.role == UserRole.CLIENT) {
      const userC = await this.userService.getUser(user.id);
      return this.travelerRepository.find({
        relations: ['coverage', 'contractor', 'origin_country', 'nationality'],
        where: { contractor: userC.contractors[0] },
      });
    }
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
  async findByFile(id: number): Promise<TravelerEntity[]> {
    const travelers = await this.travelerRepository.find({
      where: { file: id },
      relations: ['coverage', 'contractor', 'origin_country', 'nationality'],
    });
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    if (!travelers) throw new NotFoundException('The traveler does not exist');
    return travelers;
  }

  async update(
    id: string,
    updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const traveler = await this.findOne(id);
    const updateTraveler = Object.assign(traveler, updateTravelerDto);
    let coverage = new CoverageEntity();
    if (updateTraveler.coverage.id)
      coverage = await this.coverageService.getCoverage(
        updateTraveler.coverage.id,
      );
    else
      coverage = await this.coverageService.getCoverage(
        updateTraveler.coverage,
      );
    return this.travelerRepository.updateTraveler(updateTraveler, coverage);
  }

  async remove(id: string): Promise<TravelerEntity> {
    //console.log(id);
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
  async advancedSearch(
    filter: FilterTravelerDto,
    user: UserEntity,
  ): Promise<TravelerEntity[]> {
    let userC: UserEntity = undefined;
    if (user.role == UserRole.CLIENT)
      userC = await this.userService.getUser(user.id);

    return this.travelerRepository.finAdllWithFilters(filter, userC);
  }
  async getCurrrentTravelers(filter: FilterTravelerDto) {
    return this.travelerRepository.getCurrentTravelers(filter);
  }
  async getTravelerExcel(filter: FilterTravelerDto, user: UserEntity) {
    let userC: UserEntity = undefined;
    if (user.role == UserRole.CLIENT)
      userC = await this.userService.getUser(user.id);

    const travelers = await this.travelerRepository.finAdllWithFilters(
      filter,
      userC,
    );
    const columns = [
      { key: 'name', header: 'Nombre' },
      {
        key: 'contractor',
        header: 'Cliente',
      },
      { key: 'sex', header: 'Sexo' },
      { key: 'born_date', header: 'Fecha de Nacimiento' },
      { key: 'email', header: 'Correo' },

      { key: 'passport', header: 'Pasaporte' },

      { key: 'flight', header: 'Vuelo' },
      { key: 'sale_date', header: 'Fecha de Venta' },

      { key: 'start_date', header: 'Fecha de Inicio' },

      { key: 'end_date_policy', header: 'Fecha de Fin de Viaje' },

      {
        key: 'number_high_risk_days',
        header: 'Numero de dias Alto Riesgo',
      },

      { key: 'number_days', header: 'Cantidad de Dias', type: 'number' },

      {
        key: 'amount_days_high_risk',
        header: 'Monto de dias de alto riesgo',
      },

      {
        key: 'amount_days_covered',
        header: 'Monto de dias cubiertos',
      },

      { key: 'total_amount', header: 'Monto total' },

      { key: 'state', header: 'Estado' },

      { key: 'contractor', header: 'Cliente' },

      { key: 'origin_country', header: 'Pais origen' },

      { key: 'file', header: 'Fichero' },

      { key: 'nationality', header: 'Nacionalidad' },

      { key: 'coverage', header: 'Cobertura' },
    ];
    return exportExcel(travelers, columns, 'Viajeros');
  }
}
