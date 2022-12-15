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
import { ValidationError, Validator } from 'class-validator';
import { FileErrorsDto } from '../dto/fileErrors.dto';
import { CountryEntity } from 'src/country/entities/country.entity';
import { ErrorsDto } from '../dto/error.dto';
import e = require('express');

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
    let i = 2;
    //this.validateCoverage(coverages, travelers);
    const errors = await Promise.all(
      travelers.map((d) =>
        validator.validate(d, { validationError: { target: false } }),
      ),
    );
    const lisFileErrors: FileErrorsDto[] = [];
    errors.map((e) => {
      if (e.length > 0) {
        const erroFile = this.parseErrors(e);
        erroFile.row = i;
        lisFileErrors.push(erroFile);
        i++;
      }
    });
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
      const errorCoverage = this.validateCoverage(traveler, coverages);
      const errorCountry = this.validateCountry(traveler, countries);
      const erroFile = new FileErrorsDto();
      erroFile.errors = [];
      if (errorCoverage) {
        // erroFile.errors.push(...errorCoverage, ...errorCountry);
        erroFile.row = i;
        //onsole.log(erroFile.errors);
        lisFileErrors.push(erroFile);
        i++;
      }
    });
  }
 
  parseErrors(lisValidation: ValidationError[]): FileErrorsDto {
    const errorsByRow: FileErrorsDto = new FileErrorsDto();
    errorsByRow.errors = [];
    // const listByRow: ErrorsDto[] = [];
    lisValidation.map((e) => {
      const errors = new ErrorsDto();
      errors.errors = [];
      errors.property = e.property;
      const keys = Object.keys(e.constraints);
      keys.map((key) => errors.errors.push(e.constraints[key]));
      errorsByRow.errors.push(errors);
    });
    // console.log(errorsByRow.errors);
    return errorsByRow;
  }
}
