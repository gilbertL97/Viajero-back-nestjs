import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileTravelerDto } from '../dto/file-traveler.dto';
import { CalculateDaysTraveler } from './calculate-days.traveler';

export class ValidateFile {
  public static validateCoverage(
    traveler: FileTravelerDto,
    coverages: CoverageEntity[],
  ): string | CoverageEntity {
    const coverage = coverages.find((c) => traveler.coverage == c.name);
    if (!coverage) {
      return 'El plan no existe';
    }
    return coverage;
  }
  public static validateAmountHighRisk(
    coverage: CoverageEntity,
    traveler: FileTravelerDto,
  ): string | number {
    let amount_days_high_risk = 0;
    amount_days_high_risk = CalculateDaysTraveler.totalAmountHighRisk(
      traveler.number_high_risk_days,
      coverage,
    );
    if (traveler.amount_days_high_risk != amount_days_high_risk) {
      return 'El calculo no es correcto';
    }
    return amount_days_high_risk;
  }
  public static validateAmountDays(
    coverage: CoverageEntity,
    traveler: FileTravelerDto,
  ): string | number {
    const amount_days_covered: number =
      CalculateDaysTraveler.totalAmountCoveredDays(
        coverage,
        traveler.number_days,
      );
    if (amount_days_covered != traveler.amount_days_covered) {
      return 'El calculo  no es correcto';
    }
    return amount_days_covered;
  }
  public static validateTotalAmount(
    traveler: FileTravelerDto,
    amount_days_high_risk: number | string,
    amount_days_covered: number | string,
  ): string | number {
    const error = 'El calculo no es correcto';

    if (typeof amount_days_covered == 'string') {
      console.log(amount_days_covered, typeof amount_days_covered);
      return error;
    }
    if (typeof amount_days_high_risk == 'string') {
      console.log(typeof amount_days_covered);
      return error;
    }
    const total = amount_days_covered + amount_days_high_risk;
    console.log(total, traveler.total_amount);
    if (total != traveler.total_amount) {
      return error;
    }
    return total;
  }
  public static validateNationality(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): string {
    if (traveler.nationality) {
      const nationality = this.findCountry(
        traveler.nationality.toUpperCase(),
        countries,
      );
      if (!nationality) {
        return 'La nacionalidad ingresada no existe';
      }
    }
    return undefined;
  }
  public static validateOriginCountry(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): string {
    if (traveler.origin_country) {
      const origin_country = this.findCountry(
        traveler.origin_country.toUpperCase(),
        countries,
      );
      if (!origin_country) {
        return 'El Pais origen ingresado no existe';
      }
    }
    return undefined;
  }
  public static findCountry(coun: string, countries: CountryEntity[]) {
    return countries.find((country) => {
      if (coun.length == 2 && country.iso2.toUpperCase() == coun)
        return country;
      if (coun.length == 3 && country.iso.toUpperCase() == coun) return country;
      if (coun.length > 3 && country.comun_name.toUpperCase().trim() === coun)
        return country;
    });
  }
}
