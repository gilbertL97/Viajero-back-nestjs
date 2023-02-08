import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileTravelerDto } from '../dto/file-traveler.dto';
import { CalculateDaysTraveler } from './calculate-days.traveler';

export class ValidateFile {
  public static findCoverage(
    traveler: FileTravelerDto,
    coverages: CoverageEntity[],
  ): string | CoverageEntity {
    const coverage = coverages.find((c) => this.findCoverages(c, traveler));
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
      return error;
    }
    if (typeof amount_days_high_risk == 'string') {
      return error;
    }
    const total = amount_days_covered + amount_days_high_risk;
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
      if (
        country.comun_name
          .toUpperCase()
          .localeCompare(
            country.comun_name.toUpperCase().trim().toUpperCase(),
            undefined,
            {
              sensitivity: 'base',
            },
          ) == 0
      )
        return country;
    });
  }
  static isCSV(file: Express.Multer.File) {
    return (
      file.mimetype.match(/\/(csv)$/) ||
      file.mimetype.match('application/vnd.ms-excel')
    );
  }
  static isExcel(file: Express.Multer.File) {
    return file.mimetype.match(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  }
  static findCoverages(c: CoverageEntity, traveler: FileTravelerDto) {
    if (!c.configString)
      return (
        traveler.coverage
          .toUpperCase()
          .localeCompare(c.name.toUpperCase().trim().toUpperCase(), undefined, {
            sensitivity: 'base',
          }) == 0
      );
    console.log(traveler.coverage.replace(/\s/g, ''));
    return (
      traveler.coverage
        .toUpperCase()
        .localeCompare(c.name.toUpperCase().trim().toUpperCase(), undefined, {
          sensitivity: 'base',
        }) == 0
    );
  }
  static parseStringName(cadena: string, resultado: string) {
    if (cadena) {
      const contain: string[] = [];
      const notcontain: string[] = [];
      cadena = '+' + cadena;
      let word = cadena.length;
      for (let i = cadena.length - 1; i >= 0; i--) {
        const element = cadena[i];
        if (element == '+') {
          contain.push(cadena.slice(i + 1, word));
          word = i;
        }
        if (element == '-') {
          notcontain.push(cadena.slice(i + 1, word));
          word = i;
        }
      }
      const esta = contain.every((e) =>
        resultado.toUpperCase().includes(e.toUpperCase()),
      );
      const noesta = notcontain.every(
        (e) => !resultado.toUpperCase().includes(e.toUpperCase()),
      );
      const valido = esta && noesta;
      return valido;
    }
    return false;
  }
}
