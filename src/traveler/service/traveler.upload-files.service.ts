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
    const TravelersErrors: TravelerEntity[] = [];
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
      traveler.number_of_days = rows[14]; //'CANTIDAD DIAS' + rows[14]
      traveler.days_high_risk_import = rows[15]; //'IMPORTE DIAS ALTO RIESGO ' + rows[15]
      traveler.number_of_days_import = rows[16]; //'IMPORTE DIAS CUBIERTOS ' + rows[16])
      traveler.total_days_import = rows[17]; //IMPORTE TOTAL ' + rows[17]
      travelers.push(traveler);
    });
    this.validateTravelers(travelers, coverages);
    i++;
    await FileHelper.deletFile(file.path);
  }

  async validateTravelers(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
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
    //this.validat(coverages, travelers);
    console.log(lisFileErrors);
    return lisFileErrors;
  }

  validat(coverages: CoverageEntity[], travelers: FileTravelerDto[]) {
    const lisFileErrors: FileErrorsDto[] = [];
    const erroFile = new FileErrorsDto();
    erroFile.errors = [];
    const i = 0;
    travelers.map((traveler) => {
      const errorCoverage = this.validateCoverage(traveler, coverages);
      console.log(errorCoverage);
      if (errorCoverage instanceof String)
        erroFile.errors.push(errorCoverage as string);
    });
  }
  validateCoverage(traveler: FileTravelerDto, coverages: CoverageEntity[]) {
    const coverage = coverages.find((c) => traveler.coverage == c.name);
    if (coverage) return coverage;
    return 'La cobertura no existe por lo tanto no se podran realizar los calculos';
  }
}
