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
import { CreateTravelerDto } from '../dto/create-traveler.dto';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';

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
    await FileHelper.deletFile(file.path);
    const erors = await this.validateTravelers(travelers, coverages, countries);
    if (erors) return erors;
    return this.insertTraveler(travelers, coverages, countries, client);
  }

  async insertTraveler(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
    client: ContratorEntity,
  ) {
    const createTraveler = new CreateTravelerDto();
    travelers.map(async (traveler) => {
      const coverage = coverages.find((c) => travelers[1].coverage == c.name);
      const origin = ValidateFile.findCountry(
        traveler.origin_country,
        countries,
      );
      const nationality = ValidateFile.findCountry(
        traveler.nationality,
        countries,
      );
      const obj = Object.assign(createTraveler, traveler);
      await this.travelerRepository.createTraveler(
        obj,
        coverage,
        client,
        nationality,
        origin,
      );
    });
    return 'ok';
  }
  async validateTravelers(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
  ): Promise<FileErrorsDto[]> {
    const validator = new Validator();
    let i = 2;
    const listFileErrors: FileErrorsDto[] = [];
    travelers.map(async (traveler) => {
      let error = undefined;
      error = await validator.validate(traveler, {
        validationError: { target: false },
      });
      const errorHandled = this.handleErrors(error, i);
      const manualErrors = this.manualValidation(
        coverages,
        traveler,
        countries,
      );
      listFileErrors.push(this.parseErors(errorHandled, manualErrors));
      i++;
    });
    return listFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ) {
    const fileErrors: FileErrorsDto = new FileErrorsDto();
    fileErrors.errors = [];
    const coverage = ValidateFile.validateCoverage(traveler, coverages);
    if (coverage instanceof CoverageEntity) {
      const amount_days_covered = ValidateFile.validateAmountDays(
        coverage,
        traveler,
      );
      if (amount_days_covered instanceof ErrorsDto)
        fileErrors.errors.push(amount_days_covered);

      const amount_days_high_risk = ValidateFile.validateAmountHighRisk(
        coverage,
        traveler,
      );
      if (amount_days_high_risk instanceof ErrorsDto)
        fileErrors.errors.push(amount_days_high_risk);
      const total = ValidateFile.validateTotalAmount(
        traveler,
        amount_days_high_risk,
        amount_days_covered,
      );
      if (total instanceof ErrorsDto) fileErrors.errors.push(total);
    } else fileErrors.errors.push(coverage);
    const nationality = ValidateFile.validateNationality(traveler, countries);
    if (nationality) fileErrors.errors.push(nationality);
    const origin = ValidateFile.validateOriginCountry(traveler, countries);
    if (origin) fileErrors.errors.push(origin);
    return fileErrors;
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
    errorsByRow.row = row;
    return errorsByRow;
  }
  findErrorsInList(automaticErrors: FileErrorsDto, prop: string): ErrorsDto {
    return automaticErrors.errors.find((e) => e.property == prop);
  }
  parseErors(
    handleErrors: FileErrorsDto,
    manualErrors: FileErrorsDto,
  ): FileErrorsDto {
    const errors = handleErrors;
    manualErrors.errors.map((aut) => {
      const error: ErrorsDto = this.findErrorsInList(
        handleErrors,
        aut.property,
      );
      if (!error) errors.errors.push(aut);
    });
    return errors;
  }
}
