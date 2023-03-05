import { EntityRepository, Repository } from 'typeorm';
import { ContratorEntity } from '../entity/contrator.entity';
import * as dayjs from 'dayjs';
@EntityRepository(ContratorEntity)
export class ContractorRepository extends Repository<ContratorEntity> {
  async getInvoicingOfMonth(date: Date) {
    const initMonth = dayjs(date).set('date', 1); //cambio la fecha a inicio del mes
    //le sumo otro mes a la fecha fin para que esete en el rango de ese mes
    const endDate = initMonth.add(1, 'month').format('YYYY-MM-DD');
    //convierto a string para trabajar con el a nivel de db
    const startDate = initMonth.format('YYYY-MM-DD');
    const query = await this.createQueryBuilder('contractor')
      .leftJoin(
        'contractor.travelers',
        'travelerEntity',
        'travelerEntity.end_date_policy >:startDate AND travelerEntity.end_date_policy <:endDate',
        { startDate, endDate },
      )
      .addSelect('SUM(travelerEntity.total_amount)', 'totalImport')
      .addSelect('count(travelerEntity.id)', 'totaltravelers')
      /*.loadRelationCountAndMap(
        'contractor.totalTravelers',
        'contractor.travelers',
        'traveler',
        (qb) =>
          qb
            .where('traveler.end_date_policy >:startDate', { startDate })
            .andWhere('traveler.end_date_policy <:endDate', { endDate }),
      )*/
      .groupBy('contractor.id')
      //.addSelect('SUM(songs.duration)')
      /*.where('TravelerEntity.end_date_policy >:startDate', { startDate })
      .andWhere('TravelerEntity.end_date_policy <:endDate', { endDate })
      .innerJoinAndSelect('contractor.travelers', 'TravelerEntity')*/
      .getRawMany();
    console.log(query);
    return query;
  }
}
