import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileHelper } from 'src/common/file/file.helper';
import { ContractorService } from 'src/contractor/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CoverageService } from 'src/coverage/coverage.service';
import { TravelerRepository } from '../repository/traveler.repository';
import Excel = require('exceljs');
import { TravelerEntity } from '../entity/traveler.entity';
import { CalculateDaysTraveler } from '../helper/calculate-days.traveler';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileTravelerDto } from '../dto/file-traveler.dto';
import { Validator } from 'class-validator';
import { FileErrorsDto } from '../dto/fileErrors.dto';
import { CountryEntity } from 'src/country/entities/country.entity';

@Injectable()
export class TravelerUploadFilesService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
  ) {}
  async processFile(file: Express.Multer.File, idClient: number) {
    //const TravelersErrors: TravelerEntity[] = [];
    const client = await this.contratctoService.getContractor(idClient);
    const countries = await this.countryService.findAll();
    const coverages = await this.coverageService.getCoverages();
    const workbook = new Excel.Workbook();
    const excel = await workbook.xlsx.readFile(file.path);
    const worksheet = excel.getWorksheet(1);
    worksheet.spliceRows(1, 1); //elimino la primera fila que es la de los encabezados
    let i = 0;
    const travelers: FileTravelerDto[] = [];
    worksheet.eachRow(async (r) => {
      const traveler = new FileTravelerDto();
      const rows = r.values;
      traveler.name = rows[1]; //Titular ' + rows[1]);
      traveler.sex = rows[2]; //'Sexo ' + rows[2]
      traveler.born_date = rows[3]; //'Fecha de Nacimiento ' + rows[3]
      traveler.email = rows[4]; //'Correo Electrónico ' + rows[4]
      traveler.passport = rows[5]; //'PASAPORTE ' + rows[5]
      traveler.origin_country = rows[6]; //'PAIS ORIGEN ' + rows[6]
      traveler.nationality = rows[7]; //'NACIONALIDAD ' + rows[7]
      traveler.flight = rows[8]; //'VUELO ' + rows[8]
      traveler.coverage = rows[9]; //'TIPO COBERTURA ' + rows[9]
      traveler.sale_date = rows[10]; //'FECHA DE VENTA ' + rows[10]
      traveler.start_date = rows[11]; //'FECHA DE INICIO ' + rows[11]
      traveler.end_date_policy = rows[12]; //'FECHA DE FIN DE POLIZA ' + rows[12]
      traveler.number_high_risk_days = rows[13]; //'DIAS ACTIVIDAD ALTO RIESGO ' + rows[13]
      traveler.number_days = rows[14]; //'CANTIDAD DIAS' + rows[14]
      traveler.amount_days_high_risk = rows[15]; //'IMPORTE DIAS ALTO RIESGO ' + rows[15]
      traveler.amount_days_covered = rows[16]; //'IMPORTE DIAS CUBIERTOS ' + rows[16])
      traveler.total_amount = rows[17]; //IMPORTE TOTAL ' + rows[17]
      travelers.push(traveler);
    });
    this.validateTravelers(travelers, coverages, countries);
    i++;
    await FileHelper.deletFile(file.path);
  }

  async validateTravelers(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
  ): Promise<FileErrorsDto[]> {
    const validator = new Validator();
    let i = 0;
    //this.validateCoverage(coverages, travelers);
    const errors = await Promise.all(
      travelers.map((d) =>
        validator.validate(d, { validationError: { target: false } }),
      ),
    );

    const lisFileErrors: FileErrorsDto[] = [];
    errors.map((e) => {
      const erroFile = new FileErrorsDto();
      erroFile.errors = [];
      erroFile.row = i;
      e.map((e) => {
        const keys = Object.keys(e.constraints);
        keys.map((key) => erroFile.errors.push(e.constraints[key]));
      });
      lisFileErrors.push(erroFile);
      i++;
    });
    console.log(lisFileErrors);
    this.manualValidation(coverages, travelers, countries);
   
    return lisFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    travelers: FileTravelerDto[],
    countries: CountryEntity[],
  ) {
    const lisFileErrors: FileErrorsDto[] = [];
    let i = 0;
    travelers.map((traveler) => {
      const errorCoverage = this.validateCoverageAndAmount(traveler, coverages);
      const errorCountry = this.validateCountry(traveler, countries);
      const erroFile = new FileErrorsDto();
      erroFile.errors = [];
      if (errorCoverage) {
        erroFile.errors.push(...errorCoverage, ...errorCountry);
        erroFile.row = i;
        console.log(erroFile.errors);
        lisFileErrors.push(erroFile);
        i++;
      }
    });
  }
  validateCoverageAndAmount(
    traveler: FileTravelerDto,
    coverages: CoverageEntity[],
  ): string[] | void {
    const errors: string[] = [];
    const coverage = coverages.find((c) => traveler.coverage == c.name);
    if (!coverage) {
      const coverages1 = coverages.map((c) => c.name);
      errors.push(
        'La cobertura no existe, las coberturas posible son ' + coverages1,
      );
      return errors;
    }
    let amount_days_high_risk = 0;
    amount_days_high_risk = CalculateDaysTraveler.totalAmountHighRisk(
      traveler.number_high_risk_days,
      coverage,
    );
    if (traveler.amount_days_high_risk != amount_days_high_risk)
      errors.push('El calculo del monto de dias de alto riesgo no es correcto');
    const amount_days_covered = CalculateDaysTraveler.totalAmountCoveredDays(
      coverage,
      traveler.number_days,
    );
    if (amount_days_covered != traveler.amount_days_covered)
      errors.push('El calculo del monto de dias cubierto no es correcto');
    const total = amount_days_covered + amount_days_high_risk;
    if (total != traveler.total_amount)
      errors.push('El calculo del monto total no es correcto');
    return errors;
  }
  validateCountry(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): string[] {
    const errors = [];
    if (traveler.origin_country) {
      let origin_country: CountryEntity = undefined;
      origin_country = this.findCountry(
        traveler.origin_country.toUpperCase(),
        countries,
      );
      if (!origin_country) errors.push('El Pais origen ingresado no existe');
    }
    if (traveler.nationality) {
      let nationality: CountryEntity = new CountryEntity();
      nationality = this.findCountry(
        traveler.nationality.toUpperCase(),
        countries,
      );
      if (!nationality) errors.push('La nacionalidad ingresada no existe');
    }

    return errors;
  }
  findCountry(coun: string, countries: CountryEntity[]) {
    return countries.find((country) => {
      if (coun.length == 2 && country.iso2.toUpperCase() == coun)
        return country;
      if (coun.length == 3 && country.iso.toUpperCase() == coun) return country;
      if (coun.length > 3) {
        if (
          country.comun_name.toUpperCase().startsWith('CAN') &&
          country.comun_name.toUpperCase().trim() === coun
        ) {
          console.log(country.comun_name.toUpperCase(), coun);
          return country;
        }
      }
    });
  }
}
