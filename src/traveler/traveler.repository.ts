import { BadRequestException } from '@nestjs/common';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { TravelerEntity } from './entity/traveler.entity';
import { CalculateDaysTraveler } from './helper/calculate-days.traveler';

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
    const newTraveler = await this.save(traveler).catch(() => {
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
    console.log(updateTraveler);
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
}
