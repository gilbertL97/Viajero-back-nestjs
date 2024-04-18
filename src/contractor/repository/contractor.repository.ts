import { Repository } from 'typeorm';
import { ContratorEntity } from '../entity/contrator.entity';
import * as dayjs from 'dayjs';
import { ContractorResponseDto } from '../dto/contractor-response.dto';
import { FilterContractorDto } from '../dto/filter-contractor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.const';
import { ContractorPolicyResDto } from '../dto/contractor-PolicyResume.dto';

export class ContractorRepository extends Repository<ContratorEntity> {
  constructor(
    @InjectRepository(ContratorEntity, Configuration.POSTGRESCONNECT)
    repository: Repository<ContratorEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getInvoicingOfMonth(dateInvoicing: Date, id: number): Promise<any> {
    const initMonth = dayjs(dateInvoicing).set('date', 1); //cambio la fecha a inicio del mes
    //le sumo otro mes a la fecha fin para que esete en el rango de ese mes
    const endDate = initMonth.add(1, 'month').format('YYYY-MM-DD');
    //convierto a string para trabajar con el a nivel de dbc
    const startDate = initMonth.format('YYYY-MM-DD');
    const query = this.createQueryBuilder('contractor')
      .leftJoin(
        'contractor.travelers',
        'travelerEntity',
        'travelerEntity.start_date >:startDate AND travelerEntity.start_date <:endDate',
        { startDate, endDate },
      )
      .addSelect('SUM(travelerEntity.total_amount)', 'total_import')
      .addSelect('count(travelerEntity.id)', 'total_travelers')
      .groupBy('contractor.id');
    if (id) {
      query.andWhere('contractor.id=:id', { id });
    }
    return this.getTotal(
      this.convertInObjectCOntractor(await query.getRawMany()),
    );
  }
  async getDetailedTravelers(
    filter: FilterContractorDto,
    id: number,
  ): Promise<ContratorEntity[]> {
    const { dateInvoicing, ids } = filter;
    const initMonth = dayjs(dateInvoicing).set('date', 1); //cambio la fecha a inicio del mes
    //le sumo otro mes a la fecha fin para que esete en el rango de ese mes
    const endDate = initMonth.add(1, 'month').format('YYYY-MM-DD');
    //convierto a string para trabajar con el a nivel de dbc
    const startDate = initMonth.format('YYYY-MM-DD');
    const query = this.createQueryBuilder('contractor').leftJoinAndSelect(
      'contractor.travelers',
      'travelerEntity',
      'travelerEntity.start_date >:startDate AND travelerEntity.start_date <:endDate',
      { startDate, endDate },
    );
    query
      .leftJoinAndSelect('travelerEntity.coverage', 'coverage')
      .leftJoinAndSelect('travelerEntity.contractor', 'contractorss')
      .leftJoinAndSelect('travelerEntity.origin_country', 'origin_country')
      .leftJoinAndSelect('travelerEntity.nationality', 'nationality')
      .leftJoinAndSelect('travelerEntity.file', 'file');
    if (id) {
      query.andWhere('contractor.id=:id', { id });
    }
    if (ids && !id) {
      query.andWhereInIds(ids);
    }
    return (await query.getMany()).filter((c) => c.travelers.length > 0);
  }
  async policyOverview(filter: FilterContractorDto, id: number): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { dateInitFactRange, dateEndFactRange, ids } = filter; //cambio la fecha a inicio del mes
    if (!dateInitFactRange)
      dateInitFactRange = dayjs(new Date())
        .set('month', 0)
        .set('date', 1)
        .format('YYYY-MM-DD');
    if (!dateEndFactRange)
      dateEndFactRange = dayjs(new Date())
        .set('month', 11)
        .set('date', 31)
        .format('YYYY-MM-DD');
    const query = this.createQueryBuilder('contractor')
      .select(['contractor.client', 'traveler.start_date'])
      .addSelect('SUM(traveler.total_amount)', 'total_import')
      .addSelect('COUNT(traveler.id)', 'total_travelers');

    query.leftJoin('contractor.travelers', 'traveler');

    query
      .where('traveler.start_date > :dateInitFactRange', {
        dateInitFactRange,
      })
      .andWhere('traveler.start_date < :dateEndFactRange', {
        dateEndFactRange,
      });

    query.groupBy('traveler.start_date').addGroupBy('contractor.client');
    if (id) {
      query.andWhere('contractor.id=:id', { id });
    }
    if (ids && !id) {
      console.log(ids);
      query.andWhereInIds(ids);
    }
    // return this.getTotal(
    //   this.convertInObjectCOntractor(await query.getRawMany()),
    // );
    return this.returnContractorPolicyAndTotal(await query.getRawMany());
  }
  convertInObjectCOntractor(list: any[]): ContractorResponseDto[] {
    return list
      .map((l) => {
        const contractor: ContractorResponseDto = {
          id: l.contractor_id,
          client: l.contractor_client,
          email: l.contractor_email,
          telf: l.contractor_telf,
          addres: l.contractor_addres,
          file: l.contractor_file,
          poliza: l.contractor_poliza,
          isActive: l.contractor_isActive,
          total_travelers: +l.total_travelers,
          total_import: +l.total_import,
        };
        return contractor;
      })
      .filter((c) => c.total_import > 0);
  }
  getTotal(contractors: ContractorResponseDto[]) {
    let total_amount = 0;
    let total_travelers = 0;
    contractors.map((c) => {
      total_amount += c.total_import;
      total_travelers += c.total_travelers;
    });
    return { contractors, total_amount, total_travelers };
  }
  returnContractorPolicyAndTotal(list: any[]) {
    let totalTravelers = 0,
      totalAmount = 0;
    const contractors: ContractorPolicyResDto[] = list.map((l) => {
      totalTravelers += +l.total_travelers;
      totalAmount += +l.total_import;
      return {
        client: l.contractor_client as string,
        start_date: l.traveler_start_date as string,
        total_travelers: l.total_travelers as number,
        total_import: l.total_import as number,
      };
    });
    return { contractors, totalAmount, totalTravelers };
  }
}
