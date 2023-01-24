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
import { CountryEntity } from 'src/country/entities/country.entity';
import { ValidateFile } from '../helper/validation.file';
import { ExcelJSCOn } from '../repository/excelConection';
import { CreateTravelerDto } from '../dto/create-traveler.dto';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import dayjs = require('dayjs');
import { FileErrorsTravelerDto } from '../dto/fileErrorsTravelers.dto';

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
  ): Promise<FileTravelerDto[] | FileErrorsTravelerDto[] | void> {
    //const TravelersErrors: TravelerEntity[] = [];
    const client = await this.contratctoService.getContractor(idClient);
    const countries = await this.countryService.findAll();
    const coverages = await this.coverageService.getCoverages();
    const travelers = await ExcelJSCOn.getTravelerByFile(file);
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
  ): Promise<FileErrorsTravelerDto[] | void> {
    const validator = new Validator();
    let i = 2;
    const listFileErrors: FileErrorsTravelerDto[] = [];
    for (const traveler of travelers) {
      let error: ValidationError[] = undefined;
      error = await validator.validate(traveler, {
        validationError: { target: false },
      });
      const manualErrors: FileErrorsTravelerDto = this.manualValidation(
        coverages,
        traveler,
        countries,
      );
      const errors = this.parseErors(this.handleErrors(error), manualErrors);
      if (errors) {
        errors.row = i;
        listFileErrors.push(errors);
      }
      i++;
    }
    if (listFileErrors.length > 0) return listFileErrors;
  }

  manualValidation(
    coverages: CoverageEntity[],
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): FileErrorsTravelerDto | undefined {
    const fileErrors = new FileErrorsTravelerDto();
    //fileErrors.errors = [];
    const coverage = ValidateFile.validateCoverage(traveler, coverages);
    if (coverage instanceof CoverageEntity) {
      const amount_days_covered = ValidateFile.validateAmountDays(
        coverage,
        traveler,
      );
      if (typeof amount_days_covered == 'string')
        fileErrors.amount_days_covered = amount_days_covered;
      const amount_days_high_risk = ValidateFile.validateAmountHighRisk(
        coverage,
        traveler,
      );
      if (typeof amount_days_high_risk == 'string')
        fileErrors.amount_days_high_risk = amount_days_high_risk;
      const total = ValidateFile.validateTotalAmount(
        traveler,
        amount_days_high_risk,
        amount_days_covered,
      );
      if (typeof total == 'string') fileErrors.total_amount = total;
    } else fileErrors.coverage = coverage;
    const nationality = ValidateFile.validateNationality(traveler, countries);
    if (nationality) fileErrors.nationality = nationality;
    const origin = ValidateFile.validateOriginCountry(traveler, countries);
    if (origin) fileErrors.origin_country = origin;
    return fileErrors;
  }

  handleErrors(lisValidation: ValidationError[]): FileErrorsTravelerDto {
    const fileErrors = new FileErrorsTravelerDto();
    lisValidation.map((e) => {
      if (e.property) {
        const key = Object.keys(e.constraints);
        fileErrors[e.property] = e.constraints[key[0]];
      }
    });

    if (Object.entries.length > 0) return fileErrors;

    return undefined;
  }
  parseErors(
    handleErrors: FileErrorsTravelerDto | undefined,
    manualErrors: FileErrorsTravelerDto | undefined,
  ): FileErrorsTravelerDto {
    let errors = new FileErrorsTravelerDto();
    const isNotEmptyHE = handleErrors && this.isNotEmptyObject(handleErrors);
    const isNotEmptyME = manualErrors && this.isNotEmptyObject(manualErrors);
    if (isNotEmptyHE && isNotEmptyME) {
      errors = Object.assign(errors, manualErrors, handleErrors);
      return errors;
    }
    if (!isNotEmptyME && isNotEmptyHE) return handleErrors;
    if (!isNotEmptyHE && isNotEmptyME) return manualErrors;
  }
  isNotEmptyObject(obj: any): boolean {
    return Object.entries(obj).length > 0 ? true : false;
  }
}
