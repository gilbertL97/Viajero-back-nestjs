import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileHelper } from 'src/common/file/file.helper';
import { ContractorService } from 'src/contractor/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CoverageService } from 'src/coverage/coverage.service';
import { TravelerRepository } from '../repository/traveler.repository';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileTravelerDto } from '../dto/file-traveler.dto';
import { ValidationError, Validator } from 'class-validator';
import { FileErrorsDto } from '../dto/fileErrors.dto';
import { CountryEntity } from 'src/country/entities/country.entity';
import { ErrorsDto } from '../dto/error.dto';
import { UploadFileDtoProps, ValidateFile } from '../helper/validation.file';
import { ExcelJSCOn } from '../repository/excelConection';

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
    const travelers = await ExcelJSCOn.getTravelerByExcel(file);
    this.validateTravelers(travelers, coverages, countries);
    await FileHelper.deletFile(file.path);
  }

  async validateTravelers(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
  ): Promise<FileErrorsDto[]> {
    const validator = new Validator();
    let i = 2;
    const listFileErrors: FileErrorsDto[] = [];
    const errors = [];
    travelers.map(async (traveler) => {
      let error = undefined;
      error = await validator.validate(traveler, {
        validationError: { target: false },
      });
      const errorHandled = this.handleErrors(error, i);
      /* errors = this.manualValidation(
        coverages,
        traveler,
        countries,
        errorHandled,
      );*/
      //console.log(error);
      i++;
    });

    //this.validateCoverage(coverages, travelers);
    /*const errors = await Promise.all(
      travelers.map((d) =>
        validator.validate(d, { validationError: { target: false } }),
      ),
    );
   
    errors.map((e) => {
      if (e.length > 0) {
        const erroFile = this.handleErrors(e);
        erroFile.row = i;
        listFileErrors.push(erroFile);
        i++;
      }
    });
    console.log(listFileErrors);
    this.manualValidation(coverages, travelers, countries, listFileErrors);*/
    return listFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    traveler: FileTravelerDto,
    countries: CountryEntity[],
    automaticErrors: FileErrorsDto,
  ) {
    const lisFileErrors: FileErrorsDto[] = [];
    let i = 0;

    let coverage: any = this.findErrorsInList(
      automaticErrors,
      UploadFileDtoProps.COVERAGE,
    );
    //const coverage = ValidateFile.validateCoverage(traveler, coverages);
    //let amount_days_covered = undefined;
    //let amount_days_high_risk = undefined;
    //const total = undefined;
    const nationality = ValidateFile.validateNationality(traveler, countries);
    const origin = ValidateFile.validateOriginCountry(traveler, countries);
    //console.log(nationality, origin, coverage);
    console.log(coverage);
    if (!coverage) {
      coverage = ValidateFile.validateCoverage(traveler, coverages);
      if (coverage instanceof CoverageEntity) {
        let amount_days_covered: any = this.findErrorsInList(
          automaticErrors,
          UploadFileDtoProps.AMUOUNT_DAYS,
        );
        if (!amount_days_covered)
          amount_days_covered = ValidateFile.validateAmountDays(
            coverage,
            traveler,
          );

        let amount_days_high_risk: any = this.findErrorsInList(
          automaticErrors,
          UploadFileDtoProps.AMOUNT_HIGH,
        );
        if (!amount_days_high_risk)
          amount_days_high_risk = ValidateFile.validateAmountHighRisk(
            coverage,
            traveler,
          );
        let total: any = this.findErrorsInList(
          automaticErrors,
          UploadFileDtoProps.TOTAL,
        );
        if (!total)
          total = ValidateFile.validateTotalAmount(
            traveler,
            amount_days_high_risk,
            amount_days_covered,
          );
      }
    }

    const erroFile = new FileErrorsDto();
    erroFile.errors = [];

    // erroFile.errors.push(...errorCoverage, ...errorCountry);
    erroFile.row = i;
    //onsole.log(erroFile.errors);
    lisFileErrors.push(erroFile);
    i++;
  }

  handleErrors(lisValidation: ValidationError[], row: number): FileErrorsDto {
    const errorsByRow: FileErrorsDto = new FileErrorsDto();
    errorsByRow.errors = [];
    // const listByRow: ErrorsDto[] = [];
    lisValidation.map((e) => {
      const errors = new ErrorsDto();
      errors.property = e.property;
      const key = Object.keys(e.constraints);
      errors.errors = e.constraints[key[0]];
      errorsByRow.errors.push(errors);
    });
    //console.log(errorsByRow.errors);
    return errorsByRow;
  }
  findErrorsInList(automaticErrors: FileErrorsDto, prop: string) {
    return automaticErrors.errors.find((e) => e.property == prop);
  }
}
