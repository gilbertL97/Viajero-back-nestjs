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
import { ValidateFile } from '../helper/validation.file';
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
    let i = 0;
    const travelers = await ExcelJSCOn.getTravelerByExcel(file);
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
    const listFileErrors: FileErrorsDto[] = [];
    errors.map((e) => {
      if (e.length > 0) {
        const erroFile = this.handleErrors(e);
        erroFile.row = i;
        listFileErrors.push(erroFile);
        i++;
      }
    });
    this.manualValidation(coverages, travelers, countries, listFileErrors);
    return listFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    travelers: FileTravelerDto[],
    countries: CountryEntity[],
    automaticErrors: FileErrorsDto[],
  ) {
    const lisFileErrors: FileErrorsDto[] = [];
    let i = 0;
    travelers.map((traveler) => {
      const coverage = ValidateFile.validateCoverage(traveler, coverages);
      let amount_days_covered = undefined;
      let amount_days_high_risk = undefined;
      let total = undefined;
      if (coverage instanceof CoverageEntity) {
        amount_days_covered = ValidateFile.validateAmountDays(
          coverage,
          traveler,
        );
        amount_days_high_risk = ValidateFile.validateAmountHighRisk(
          coverage,
          traveler,
        );
        total = ValidateFile.validateTotalAmount(
          traveler,
          amount_days_high_risk,
          amount_days_covered,
        );
      } else {
        if()
      }
      const nationality = ValidateFile.validateNationality(traveler, countries);
      const origin = ValidateFile.validateOriginCountry(traveler, countries);
      const erroFile = new FileErrorsDto();
      erroFile.errors = [];

      // erroFile.errors.push(...errorCoverage, ...errorCountry);
      erroFile.row = i;
      //onsole.log(erroFile.errors);
      lisFileErrors.push(erroFile);
      i++;
    });
  }

  handleErrors(lisValidation: ValidationError[]): FileErrorsDto {
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
  findErrorsInList(automaticErrors: FileErrorsDto, error: ErrorsDto) {
    return automaticErrors.errors.find((e) => e.property == error.property);
  }
}
