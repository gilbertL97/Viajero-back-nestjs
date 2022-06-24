import { DateHelper } from 'src/common/helper/date.helper';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { CreateTravelerDto } from '../dto/create-traveler.dto';

export class CalculateDaysTraveler {
  public static calculateNumberDays(
    createTravelerDto: CreateTravelerDto,
  ): number {
    return DateHelper.daysDifference(
      createTravelerDto.end_date_policy,
      createTravelerDto.start_date,
    );
  }
  public static totalAmountHighRisk(
    createTravelerDto: CreateTravelerDto,
  ): number | null {
    console.log(createTravelerDto.number_high_risk_days);
    if (createTravelerDto.number_high_risk_days) {
      const highRiskActivity = 2; // esta es la actividad de alto riesgo hay q ver de q manera se hace parametrizable
      return highRiskActivity * createTravelerDto.number_high_risk_days;
    }
    return null;
  }
  public static totalAmountCoveredDays(
    coverage: CoverageEntity,
    days: number,
  ): number {
    if (!coverage.daily) return coverage.price;
    return coverage.price * days;
  }
  public static totalAmount(
    amountDays: number,
    amountHighRisk: number | undefined,
  ): number {
    if (amountHighRisk) return amountHighRisk + amountDays;
    return amountDays;
  }
}
