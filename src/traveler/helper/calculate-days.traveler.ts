import { DateHelper } from 'src/common/helper/date.helper';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';

export class CalculateDaysTraveler {
  public static calculateNumberDays(
    end_date_policy: Date,
    start_date: Date,
  ): number {
    return DateHelper.daysDifference(end_date_policy, start_date) + 1;
  }
  public static totalAmountHighRisk(
    number_high_risk_days: number,
    coverage: CoverageEntity,
  ): number | null {
    if (coverage.daily) {
      const highRiskActivity = coverage.high_risk; // esta es la actividad de alto riesgo hay q ver de q manera se hace parametrizable
      return highRiskActivity * number_high_risk_days;
    }
    return 0;
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
