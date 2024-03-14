import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileHelper } from 'src/common/file/file.helper';
import { ContractorService } from 'src/contractor/service/contractor.service';
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
import { FileService } from 'src/file/service/file.service';
import { TravelerEntity } from '../entity/traveler.entity';
import { ResponseErrorOrWarningDto } from '../dto/responseErrorOrWarning.dto';
import { RepeatTravelerError } from '../error/errorRepeatTraveler';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TravelerUploadFilesService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}
  async processFile(
    file: Express.Multer.File,
    idClient: number,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    //1-pirmero cargo todos los paises clientes y planes en memoria
    const [client, countries, coverages, userEntity] = await Promise.all([
      this.contratctoService.getContractor(idClient),
      this.countryService.findAll(),
      this.coverageService.getCoveragesActives(),
      this.userService.getUser(user.id),
    ]);
    //2-cargo el archivo dependiendo del tipo de archivo
    const travelers = await ExcelJSCOn.getTravelerByFile(file, coverages);
    if (travelers.length == 0) {
      throw new BadRequestException(
        'El fichero esta vacio o no se encuentran viajeros',
      );
    } // 3-elimino el archivo
    await FileHelper.deletFile(file.path);
    //4-valido para saber si hay errores primero cambiar todo para maNhaba

    const errors = await this.validateTravelersErrors(travelers, coverages);
    if (errors)
      return this.bindWarningsAndErrors(
        errors,
        await this.validateTravelersWarnings(travelers, countries),
      );
    //5-inserto y verifico si hay viajeros repetidos
    return await this.insertTraveler(
      travelers,
      coverages,
      countries,
      client,
      file.originalname,
      userEntity,
    );
  }
  async processOneFile(
    file: Express.Multer.File,
    idClient: number,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    //1-pirmero cargo todos los paises clientes y planes en memoria
    const [client, countries, coverages, userEntity] = await Promise.all([
      this.contratctoService.getContractor(idClient),
      this.countryService.findAll(),
      this.coverageService.getCoveragesActives(),
      this.userService.getUser(user.id),
    ]);
    //2-cargo el archivo dependiendo del tipo de archivo
    const travelers = await ExcelJSCOn.getTravelerByFile(file, coverages);
    if (travelers.length == 0) {
      throw new BadRequestException(
        'El fichero esta vacio o no se encuentran viajeros',
      );
    } // 3-elimino el archivo
    await FileHelper.deletFile(file.path);
    //4-valido para saber si hay errores primero cambiar todo para maNhaba

    const errors = await this.validateTravelersErrors(travelers, coverages);
    if (errors)
      return this.bindWarningsAndErrors(
        errors,
        await this.validateTravelersWarnings(travelers, countries),
      );
    //5-inserto y verifico si hay viajeros repetidos
    return await this.insertTraveler(
      travelers,
      coverages,
      countries,
      client,
      file.originalname,
      userEntity,
    );
  }
  async processBulkFile(
    file: string,
    client: ContratorEntity,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    //1-pirmero cargo todos los paises clientes y planes en memoria
    const [countries, coverages, userEntity] = await Promise.all([
      this.countryService.findAll(),
      this.coverageService.getCoveragesActives(),
      this.userService.getUser(user.id),
    ]);
    //2-cargo el archivo dependiendo del tipo de archivo
    const travelers = await ExcelJSCOn.getTravelerByFileBulk(file, coverages);

    if (travelers.length == 0) {
      const empty = new FileErrorsTravelerDto();
      const errors: FileErrorsTravelerDto[] = [];
      empty.others.push('El fichero esta vacio o no se encuentran viajeros');
      errors.push(empty);
      return new ResponseErrorOrWarningDto(errors, true);
    }

    // 3-elimino el archivo o muevo tengo q ver
    //await FileHelper.deletFile(file);
    //4-valido para saber si hay errores primero cambiar todo para maNhaba

    const errors = await this.validateTravelersErrors(travelers, coverages);
    if (errors)
      return this.bindWarningsAndErrors(
        errors,
        await this.validateTravelersWarnings(travelers, countries),
      );
    //5-inserto y verifico si hay viajeros repetidos
    const fileName = FileHelper.getFileName(file);
    return await this.insertTraveler(
      travelers,
      coverages,
      countries,
      client,
      fileName,
      userEntity,
    );
  }
  async insertTraveler(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
    client: ContratorEntity,
    file: string,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    const createTraveler = new CreateTravelerDto();
    const warn: FileErrorsTravelerDto[] = [];
    const travelersFile: TravelerEntity[] = [];
    const file2 = await this.verifyAndDeletFile(file, client, user);
    let row = 2;
    for (const traveler of travelers) {
      // necesito terminar esto para mañana primero validar cada viajero sanitizar guaradra si hay error
      // por cada viajero
      const coverage = ValidateFile.findCoverage(traveler, coverages);
      const warning = await this.validateOneTravelersWarning(
        traveler,
        countries,
      );
      if (warning) this.amendWarningsInTravelers(traveler, warning);

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
      const travelerfil = await this.travelerRepository
        .createTraveler(
          obj,
          coverage as CoverageEntity,
          client,
          nationality,
          origin,
          file2,
        )
        .catch((error) => {
          if (error instanceof RepeatTravelerError) {
            if (warning) warning.duplicate = true;
            else {
              const duplicate = new FileErrorsTravelerDto();
              duplicate.duplicate = true;
              duplicate.row = row;
              warn.push(duplicate);
            }
            //arreglar este metodo para mañana
          } else throw error;
        });
      if (travelerfil) travelersFile.push(travelerfil);

      if (warning) {
        warning.row = row;
        warn.push(warning);
      }
      row++;
    }
    if (travelersFile.length == 0) {
      this.fileService.remove(file2.id);
    }

    if (warn.length > 0) {
      return new ResponseErrorOrWarningDto(warn, false);
    }
  }
  async validateTravelersErrors(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
  ): Promise<FileErrorsTravelerDto[] | void> {
    const validator = new Validator();
    let i = 2; //numero de fila minimo
    const listFileErrors: FileErrorsTravelerDto[] = [];
    for (const traveler of travelers) {
      const validatorError = await validator.validate(traveler, {
        groups: ['errors'],
        validationError: { target: false },
        skipMissingProperties: false,
      });
      const validationErrors = this.handleErrors(validatorError);
      const errors: FileErrorsTravelerDto = this.manualValidationErrors(
        coverages,
        traveler,
        validationErrors,
      );
      if (errors) {
        errors.row = i;
        listFileErrors.push(errors);
      }
      i++;
    }
    if (listFileErrors.length > 0) return listFileErrors;
  }

  async validateTravelersWarnings(
    travelers: FileTravelerDto[],
    countries: CountryEntity[],
  ): Promise<FileErrorsTravelerDto[] | void> {
    let i = 2; //numero de fila minimo
    const listWarnings: FileErrorsTravelerDto[] = [];
    for (const traveler of travelers) {
      const warnings = await this.validateOneTravelersWarning(
        traveler,
        countries,
      );
      if (warnings) {
        warnings.row = i;
        listWarnings.push(warnings);
      }
      i++;
    }
    if (listWarnings.length > 0) return listWarnings;
  }

  async validateOneTravelersWarning(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
  ): Promise<FileErrorsTravelerDto | undefined> {
    const validator = new Validator();
    const validatorWarnings = await validator.validate(traveler, {
      groups: ['warnings'],
      validationError: { target: false },
    });
    const validationWarnings = this.handleErrors(validatorWarnings);

    const validations = this.manualValidationsWarnings(
      traveler,
      countries,
      validationWarnings,
    );
    return validations;
  }
  manualValidationErrors(
    coverages: CoverageEntity[],
    traveler: FileTravelerDto,
    validationErrors: FileErrorsTravelerDto,
  ): FileErrorsTravelerDto | undefined {
    const fileErrors = new FileErrorsTravelerDto();
    //fileErrors.errors = [];
    const coverage = ValidateFile.findCoverage(traveler, coverages);
    if (coverage instanceof CoverageEntity) {
      if (
        //este fue el cambio q me pidio evely quitar los errores innecesarios en las fechas
        this.haveValidationsDate(validationErrors)
      ) {
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
        if (!coverage.daily)
          this.amendDateNoDaylyInCoverages(
            validationErrors,
            traveler,
            coverage,
          );
      } else validationErrors.number_days = undefined;
    } else fileErrors.coverage = coverage;
    return this.parseErors(validationErrors, fileErrors);
  }
  manualValidationsWarnings(
    traveler: FileTravelerDto,
    countries: CountryEntity[],
    fileWarnings?: FileErrorsTravelerDto,
  ) {
    const warnings = new FileErrorsTravelerDto();
    const nationality = ValidateFile.validateNationality(traveler, countries);
    if (nationality) warnings.nationality = nationality;
    const origin = ValidateFile.validateOriginCountry(traveler, countries);
    if (origin) warnings.origin_country = origin;
    if (fileWarnings) return Object.assign(fileWarnings, warnings);
    if (origin || nationality) return warnings;
  }
  handleErrors(
    lisValidation: ValidationError[],
  ): FileErrorsTravelerDto | undefined {
    const fileErrors = new FileErrorsTravelerDto();
    lisValidation.map((e) => {
      if (e.property) {
        const key = Object.keys(e.constraints);
        fileErrors[e.property] = e.constraints[key[0]];
      }
    });

    if (Object.entries(fileErrors).length > 0) return fileErrors;

    return undefined;
  }
  parseErors(
    validationErrors: FileErrorsTravelerDto | undefined,
    manualErrors: FileErrorsTravelerDto | undefined,
  ): FileErrorsTravelerDto {
    let errors = new FileErrorsTravelerDto();
    const isNotEmptyHE =
      validationErrors && this.isNotEmptyObject(validationErrors);
    const isNotEmptyME = manualErrors && this.isNotEmptyObject(manualErrors);
    if (isNotEmptyHE && isNotEmptyME) {
      errors = Object.assign(errors, manualErrors, validationErrors);
      return errors;
    }
    if (!isNotEmptyME && isNotEmptyHE) return validationErrors;
    if (!isNotEmptyHE && isNotEmptyME) return manualErrors;
  }
  isNotEmptyObject(obj: any): boolean {
    return Object.entries(obj).length > 0 ? true : false;
  }
  async verifyAndDeletFile(
    file: string,
    client: ContratorEntity,
    user: UserEntity,
  ) {
    const fileTraveler = await this.fileService.findByName(file).catch((e) => {
      if (e instanceof NotFoundException)
        console.log('No se encuentra el archivo');
      else throw e;
    });
    if (fileTraveler) {
      await this.fileService.remove(fileTraveler.id);
    }
    return await this.fileService.create(file, client, user);
  }
  amendWarningsInTravelers(
    traveler: FileTravelerDto,
    warninngs: FileErrorsTravelerDto,
  ) {
    const key = Object.keys(warninngs);
    key.forEach((k) => {
      traveler[k] = undefined;
    });
  }
  bindWarningsAndErrors(
    errors: FileErrorsTravelerDto[],
    warnings: FileErrorsTravelerDto[] | void,
  ) {
    if (!warnings || warnings.length == 0) {
      return new ResponseErrorOrWarningDto(errors, true);
    }
    const warnAndErr = errors.map((error) => {
      const warn = warnings.find((w) => error.row == w.row);
      return Object.assign(error, warn);
    });
    return new ResponseErrorOrWarningDto(warnAndErr, true);
  }

  amendDateNoDaylyInCoverages(
    validationErrors: FileErrorsTravelerDto,
    traveler: FileTravelerDto,
    coverage: CoverageEntity,
  ) {
    if (validationErrors) {
      delete validationErrors.number_days;
    }
    traveler.end_date_policy = dayjs(traveler.start_date, 'DD/MM/YYYY') //creo una instancia de dayjs con el inicio
      .add(coverage.number_of_days, 'days') //agrego al inicio la cantidad de dias de la cobertura
      .format('DD/MM/YYYY'); //lo llevo al formato y se lo asigno al final
  }
  haveValidationsDate(validation: FileErrorsTravelerDto): boolean {
    if (!validation) return true;
    if (!validation.start_date && !validation.end_date_policy) return true;
    if (
      validation.start_date == undefined &&
      validation.end_date_policy == undefined
    )
      return true;
    return false;
  }
}
