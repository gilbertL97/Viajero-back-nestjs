import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { ErrorsDto } from '../dto/error.dto';
import { FileTravelerDto } from '../dto/file-traveler.dto';
import { CalculateDaysTraveler } from './calculate-days.traveler';

export class ValidateFile {
  public static validateCoverage(
    traveler: FileTravelerDto,
    coverages: CoverageEntity[],
  ): ErrorsDto | void {
    const coverage = coverages.find((c) => traveler.coverage == c.name);
    if (!coverage) {
      const error = new ErrorsDto();
      error.errors = [];
      error.property = 'coverage'; // esta es la propiedad coverage del dto para la cual devuelvo si da error
      const coverages1 = coverages.map((c) => c.name);
      error.errors.push(
        'La cobertura no existe, las coberturas posible son ' + coverages1,
      );
      return error;
    }
  }
  public static validateAmountHighRisk(
    coverage: CoverageEntity,
    traveler: FileTravelerDto,
  ): ErrorsDto | void {
    let amount_days_high_risk = 0;
    amount_days_high_risk = CalculateDaysTraveler.totalAmountHighRisk(
      traveler.number_high_risk_days,
      coverage,
    );
    if (traveler.amount_days_high_risk != amount_days_high_risk) {
      const error = new ErrorsDto();
      error.errors = [];
      error.property = 'amount_days_high_risk';
      error.errors.push(
        'El calculo del monto de dias de alto riesgo no es correcto',
      );
      return error;
    }
  }
  public static validateAmountDays(
    coverage: CoverageEntity,
    traveler: FileTravelerDto,
  ): ErrorsDto | void {
    const amount_days_covered = CalculateDaysTraveler.totalAmountCoveredDays(
      coverage,
      traveler.number_days,
    );
    if (amount_days_covered != traveler.amount_days_covered) {
      const error = new ErrorsDto();
      error.errors = [];
      error.property = 'amount_days_covered';
      error.errors.push('El calculo del monto de dias cubierto no es correcto');
      return error;
    }
  }
  public static validateTotalAmount(
    traveler: FileTravelerDto,
    amount_days_high_risk: number,
    amount_days_covered: number,
  ): ErrorsDto | void {
    const total = amount_days_covered + amount_days_high_risk;
    if (total != traveler.total_amount) {
      const error = new ErrorsDto();
      error.errors = [];
      error.property = 'total_amount';
      error.errors.push('El calculo del monto total no es correcto');
      return error;
    }
  }
  public static validateNationality(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): ErrorsDto | void {
    if (traveler.nationality) {
      let nationality: CountryEntity = new CountryEntity();
      nationality = this.findCountry(
        traveler.nationality.toUpperCase(),
        countries,
      );
      if (!nationality) {
        const error = new ErrorsDto();
        error.errors = [];
        error.property = 'nationality';
        error.errors.push('La nacionalidad ingresada no existe');
        return error;
      }
    }
  }
  public static validateOriginCountry(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): ErrorsDto | void {
    if (traveler.origin_country) {
      let origin_country: CountryEntity = undefined;
      origin_country = this.findCountry(
        traveler.origin_country.toUpperCase(),
        countries,
      );
      if (!origin_country) {
        const error = new ErrorsDto();
        error.errors = [];
        error.property = 'origin_country';
        error.errors.push('El Pais origen ingresado no existe');
        return error;
      }
    }
  }
  public static findCountry(coun: string, countries: CountryEntity[]) {
    return countries.find((country) => {
      if (coun.length == 2 && country.iso2.toUpperCase() == coun)
        return country;
      if (coun.length == 3 && country.iso.toUpperCase() == coun) return country;
      if (coun.length > 3) {
        if (
          country.comun_name.toUpperCase().startsWith('CAN') &&
          country.comun_name.toUpperCase().trim() === coun
        )
          return country;
      }
    });
  }
}
