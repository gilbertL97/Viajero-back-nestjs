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
import { exportPdf } from 'src/common/export/exportPdf';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationResult } from 'src/common/pagination/interface/pagination.type';
import { LogginService } from 'src/loggin/loggin.service';

@Injectable()
export class TravelerService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
    private readonly userService: UserService,
    private readonly loggingService: LogginService,
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
    this.log('agregando un viajero');
    return traveler;
  }

  async findAll(user: UserEntity): Promise<TravelerEntity[]> {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT) {
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
      relations: [
        'coverage',
        'contractor',
        'origin_country',
        'nationality',
        'file',
      ],
    });
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    if (!traveler) throw new NotFoundException('The traveler does not exist');
    this.log('Buscando un viajero');
    return traveler;
  }
  async findByFile(id: number): Promise<TravelerEntity[]> {
    const travelers = await this.travelerRepository.find({
      where: { file: { id: id } },
      relations: ['coverage', 'contractor', 'origin_country', 'nationality'],
    });
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    if (!travelers) throw new NotFoundException('The traveler does not exist');
    this.log('Buscando viajeros por archivos');
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
    return this.travelerRepository
      .updateTraveler(updateTraveler, coverage)
      .catch((error) => {
        if (error.code == 23505)
          throw new BadRequestException('Viajero duplicado');
        throw new BadRequestException('error in database');
      });
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
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      userC = await this.userService.getUser(user.id);

    return this.travelerRepository.findAllWithFiltersWithoutPagination(
      filter,
      userC,
    );
  }
  async advancedSearchPag(
    filter: FilterTravelerDto,
    user: UserEntity,
    pag: PaginationDto,
  ): Promise<PaginationResult<TravelerEntity>> {
    const userC: UserEntity = await this.userService.getUser(user.id);
    return this.travelerRepository.findAllWithFiltersPagination(
      filter,
      userC,
      pag,
    );
  }
  async getTravelerExcel(filter: FilterTravelerDto, user: UserEntity) {
    let userC: UserEntity = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      userC = await this.userService.getUser(user.id);

    const travelers =
      await this.travelerRepository.findAllWithFiltersWithoutPagination(
        filter,
        userC,
      );
    const columns = [
      { key: 'name', header: 'Nombre' },
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
        header: 'Importe de dias de alto riesgo',
      },

      {
        key: 'amount_days_covered',
        header: 'Importe de dias cubiertos',
      },

      { key: 'total_amount', header: 'Importe total' },

      { key: 'state', header: 'Vigente' },

      { key: 'contractor', header: 'Cliente' },

      { key: 'origin_country', header: 'Pais origen' },

      { key: 'file', header: 'Fichero' },

      { key: 'nationality', header: 'Nacionalidad' },

      { key: 'coverage', header: 'Cobertura' },
    ];
    return exportExcel(travelers, columns, 'Viajeros');
  }
  async getTravelerPdf(filter: FilterTravelerDto, user: UserEntity) {
    let userC: UserEntity = undefined;
    if (user.role == UserRole.CLIENT || user.role == UserRole.CONSULTAGENT)
      userC = await this.userService.getUser(user.id);

    const travelers =
      await this.travelerRepository.findAllWithFiltersWithoutPagination(
        filter,
        userC,
      );
    const columns = [
      { property: 'name', label: 'Nombre', width: 100 },

      { property: 'passport', label: 'Pasaporte', width: 80 },

      { property: 'start_date', label: 'Fecha de Inicio', width: 50 },

      {
        property: 'end_date_policy',
        label: 'Fecha de Fin de Viaje',
        width: 50,
      },

      {
        property: 'number_high_risk_days',
        label: 'Cant dias Alto Riesgo',
        width: 60,
        align: 'center',
      },

      {
        property: 'number_days',
        label: 'Num de Dias',
        width: 60,
        align: 'center',
      },

      {
        property: 'amount_days_high_risk',
        label: 'Importe alto riesgo',
        width: 60,
        align: 'center',
      },

      {
        property: 'amount_days_covered',
        label: 'Importe dias cubiertos',
        width: 60,
        align: 'center',
      },

      {
        property: 'total_amount',
        label: 'Importe total',
        width: 60,
        align: 'center',
      },

      { property: 'contractor', label: 'Cliente', width: 70 },

      { property: 'coverage', label: 'Cobertura', width: 70 },
    ];
    return exportPdf(travelers, columns, 'Viajeros', undefined, 'landscape');
  }

  async log(message: string, level = 'info') {
    this.loggingService.create({
      message,
      context: 'Traveler Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
}
