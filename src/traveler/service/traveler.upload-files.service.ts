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
import dayjs = require('dayjs');
import { DuplicateDto } from '../dto/duplicateFileError.dto';
import { TravelerEntity } from '../entity/traveler.entity';

@Injectable()
export class TravelerUploadFilesService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
  ) {}
  async processFile(
    file: Express.Multer.File,
    idClient: number,
  ): Promise<FileTravelerDto[] | FileErrorsDto[] | void> {
    //const TravelersErrors: TravelerEntity[] = [];
    const client = await this.contratctoService.getContractor(idClient);
    const countries = await this.countryService.findAll();
    const coverages = await this.coverageService.getCoverages();
    const travelers = await ExcelJSCOn.getTravelerByExcel(file);
    await FileHelper.deletFile(file.path);
    const erors = await this.validateTravelers(travelers, coverages, countries);
    if (erors) return erors;
    return await this.insertTraveler(travelers, coverages, countries, client);
  }

  async insertTraveler(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
    client: ContratorEntity,
  ): Promise<FileTravelerDto[] | void> {
    const createTraveler = new CreateTravelerDto();
    const duplicate: FileTravelerDto[] = [];
    for (const traveler of travelers) {
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
      if (obj.born_date) {
        console.log(obj.born_date);
        obj.born_date = new Date(
          dayjs(traveler.born_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        );
      }

      if (obj.sale_date)
        obj.sale_date = new Date(
          dayjs(traveler.sale_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        );
      obj.start_date = new Date(
        dayjs(traveler.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      );
      obj.end_date_policy = new Date(
        dayjs(traveler.end_date_policy, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      );
      await this.travelerRepository
        .createTraveler(obj, coverage, client, nationality, origin)
        .catch((error) => {
          if (error instanceof Error) {
            duplicate.push(traveler); //arreglar este metodo para mañana
          } else throw error;
        });
    }
    if (duplicate.length > 0) return duplicate;
  }
  async validateTravelers(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
  ): Promise<FileErrorsDto[] | void> {
    const validator = new Validator();
    let i = 2;
    const listFileErrors: FileErrorsDto[] = [];
    for (const traveler of travelers) {
      let error: ValidationError[] = undefined;
      error = await validator.validate(traveler, {
        validationError: { target: false },
      });
      let errorHandled = new FileErrorsDto();

      const manualErrors = this.manualValidation(
        coverages,
        traveler,
        countries,
      );
      if (error.length > 0) errorHandled = this.handleErrors(error, i);
      const errors = this.parseErors(errorHandled, manualErrors);
      if (errors) listFileErrors.push(errors);
      i++;
    }
    return listFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): FileErrorsDto | undefined {
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
      if (e.property) {
        const errors = new ErrorsDto();
        errors.property = e.property;
        const key = Object.keys(e.constraints);
        errors.errors = e.constraints[key[0]];
        errorsByRow.errors.push(errors);
      }
    });
    if (errorsByRow.errors.length > 0) errorsByRow.row = row;
    return errorsByRow;
  }
  findErrorsInList(
    automaticErrors: FileErrorsDto | void,
    prop: string,
  ): ErrorsDto {
    if (automaticErrors)
      return automaticErrors.errors.find((e) => e.property == prop);
  }
  parseErors(
    handleErrors: FileErrorsDto | undefined,
    manualErrors: FileErrorsDto | undefined,
  ): FileErrorsDto {
    const errors = handleErrors;
    if (manualErrors)
      if (manualErrors.errors.length > 0)
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
