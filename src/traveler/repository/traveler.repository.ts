import { BadRequestException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTravelerDto } from '../dto/create-traveler.dto';
import { FilterTravelerDto } from '../dto/filter-traveler.dto';
import { TravelerEntity } from '../entity/traveler.entity';
import { CalculateDaysTraveler } from '../helper/calculate-days.traveler';

@EntityRepository(TravelerEntity)
export class TravelerRepository extends Repository<TravelerEntity> {
  public async findAll(): Promise<TravelerEntity[]> {
    return await this.find();
  }

  async createTraveler(
    createTravelerDto: CreateTravelerDto,
    coverage: CoverageEntity,
    contractor: ContratorEntity,
    nationality: CountryEntity,
    origin_country: CountryEntity,
    file?: FileEntity,
  ): Promise<TravelerEntity> {
    const {
      name,
      email,
      passport,
      sale_date,
      start_date,
      end_date_policy,
      number_high_risk_days,
    } = createTravelerDto;
    const traveler = this.create({
      name,
      email,
      passport,
      sale_date,
      start_date,
      end_date_policy,
      number_high_risk_days,
      coverage,
      contractor,
      nationality,
      origin_country,
    });
    traveler.number_days = CalculateDaysTraveler.calculateNumberDays(
      end_date_policy,
      start_date,
    );
    traveler.amount_days_high_risk = CalculateDaysTraveler.totalAmountHighRisk(
      number_high_risk_days,
      coverage,
    );
    traveler.amount_days_covered = CalculateDaysTraveler.totalAmountCoveredDays(
      traveler.coverage,
      traveler.number_days,
    );
    traveler.total_amount = CalculateDaysTraveler.totalAmount(
      traveler.amount_days_covered,
      traveler.amount_days_high_risk,
    );
    if (file) traveler.file = file;
    const newTraveler = await this.save(traveler).catch((error) => {
      //console.log(error);
      if (error.code == 23505) throw new Error('Viajero duplicado');
      throw new BadRequestException('error in database');
    });
    return newTraveler;
  }

  async updateTraveler(
    updateTraveler: TravelerEntity,
    coverage: CoverageEntity,
  ): Promise<TravelerEntity> {
    if (
      updateTraveler.end_date_policy &&
      updateTraveler.start_date &&
      updateTraveler.number_high_risk_days &&
      updateTraveler.coverage
    ) {
      updateTraveler.number_days = CalculateDaysTraveler.calculateNumberDays(
        updateTraveler.end_date_policy,
        updateTraveler.start_date,
      );
      updateTraveler.amount_days_high_risk =
        CalculateDaysTraveler.totalAmountHighRisk(
          updateTraveler.number_high_risk_days,
          coverage,
        );
      updateTraveler.amount_days_covered =
        CalculateDaysTraveler.totalAmountCoveredDays(
          coverage,
          updateTraveler.number_days,
        );
      updateTraveler.total_amount = CalculateDaysTraveler.totalAmount(
        updateTraveler.amount_days_covered,
        updateTraveler.amount_days_high_risk,
      );
    }
    //console.log('este es el update ' + updateTraveler);
    return await this.save(updateTraveler);
  }
  async finOneTravelerWithCoverage(
    coverageOption: CoverageEntity,
  ): Promise<TravelerEntity> {
    return this.findOne({ where: { coverage: coverageOption } });
  }
  async finOneTravelerWithContractor(
    contractorOption: ContratorEntity,
  ): Promise<TravelerEntity> {
    return this.findOne({ where: { contractor: contractorOption } });
  }
  async finAdllWithFilters(
    filter: FilterTravelerDto,
    user?: UserEntity,
  ): Promise<TravelerEntity[]> {
    let contractor = filter.contractor;
    const {
      name,
      passport,
      start_date_init,
      start_date_end,
      end_date_policy_init,
      end_date_policy_end,
      nationality,
      origin_country,
      coverage,
      state,
    } = filter;

    if (user) contractor = user.contractors[0].id;
    const query = this.createQueryBuilder('viajeros');
    if (name) query.where('viajeros.name LIKE :name', { name });
    if (passport)
      query.andWhere('viajeros.passport LIKE :passport', { passport });
    if (origin_country)
      query.andWhere('viajeros.origin_country LIKE :origin_country', {
        origin_country,
      });
    if (nationality)
      query.andWhere('viajeros.nationality LIKE :nationality', { nationality });
    if (coverage) query.andWhere('viajeros.coverage =:coverage', { coverage });
    if (contractor)
      query.andWhere('viajeros.contractor =:contractor', { contractor });
    if (end_date_policy_init)
      query.andWhere('viajeros.end_date_policy >=:end_date_policy_init', {
        end_date_policy_init,
      });
    if (end_date_policy_end)
      query.andWhere('viajeros.end_date_policy <:end_date_policy_end', {
        end_date_policy_end,
      });
    if (start_date_init)
      query.andWhere('viajeros.start_date>=:start_date_init', {
        start_date_init,
      });
    if (start_date_end)
      query.andWhere('viajeros.start_date<:start_date_end', {
        start_date_end,
      });
    if (state) {
      const now = dayjs(new Date()).format('YYYY-MM-DD');
      query.andWhere('viajeros.end_date_policy >=:now', { now }); //   tengo q arreglar este problema con el state voy a seguri por ahora en el pdf*/

      //query.andWhere('viajeros.state  =:state ', { state });
    }

    return (
      query
        .leftJoinAndSelect('viajeros.nationality', 'CountryEntity')
        .leftJoinAndSelect('viajeros.origin_country', 'CountryEntitys')
        .leftJoinAndSelect('viajeros.contractor', 'ContratorEntity')
        .leftJoinAndSelect('viajeros.coverage', 'CoverageEntity')
        .leftJoinAndSelect('viajeros.file', 'FileEntity')
        //.orderBy('viajeros.name')
        .getMany()
    );
  }
  async getCurrentTravelers(filter: FilterTravelerDto) {
    //const now = dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD');
    const now = dayjs(new Date()).format('YYYY-MM-DD');

    const { state } = filter;
    const query = await this.createQueryBuilder('viajeros')
      .where('viajeros.end_date_policy >:now', { now })
      .leftJoinAndSelect('viajeros.nationality', 'CountryEntity')
      .leftJoinAndSelect('viajeros.origin_country', 'CountryEntitys')
      .leftJoinAndSelect('viajeros.contractor', 'ContratorEntity')
      .leftJoinAndSelect('viajeros.coverage', 'CoverageEntity')
      .getManyAndCount();
    console.log(state);
    return query;
  }
}
