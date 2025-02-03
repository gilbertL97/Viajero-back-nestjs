import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigService } from 'src/config/service/config.service';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CoverageService } from 'src/coverage/coverage.service';
import { LogginService } from 'src/loggin/loggin.service';
import { TravelerRepository } from 'src/traveler/repository/traveler.repository';
import { UserService } from 'src/user/user.service';
import { FileService } from './file.service';
import { FileHelper } from 'src/common/file/file.helper';
import { Configuration } from 'src/config/config.const';
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { FileTravelerDto } from 'src/traveler/dto/file-traveler.dto';
import { ResponseErrorOrWarningDto } from 'src/traveler/dto/responseErrorOrWarning.dto';
import { ExcelJSCOn } from 'src/traveler/repository/excelConection';
import { UserEntity } from 'src/user/entity/user.entity';
import { TravelerUploadFilesService } from 'src/traveler/service/traveler.upload-files.service';

@Injectable()
export class ImportFilesService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerUploadFilesService: TravelerUploadFilesService,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly configService: CustomConfigService,
    private readonly loggingService: LogginService,
  ) {}
  // Método principal para cargar datos comunes
  private async loadCommonData(idClient: number, userId: number) {
    return await Promise.all([
      this.contratctoService.getContractor(idClient),
      this.countryService.findAll(),
      this.coverageService.getCoveragesActives(),
      this.userService.getUser(userId),
    ]);
  }

  // Método para manejar el contenido del archivo
  private async handleFileContent(
    file: Express.Multer.File | string,
    coverages: CoverageEntity[],
  ) {
    const travelers =
      typeof file === 'string'
        ? await ExcelJSCOn.getTravelerByFileBulk(file, coverages)
        : await ExcelJSCOn.getTravelerByFile(file, coverages);

    this.log('Leyendo los datos del fichero');
    if (travelers.length === 0) {
      throw new BadRequestException(
        'El fichero está vacío o no se encuentran viajeros',
      );
    }
    return travelers;
  }

  // Método para manejar la validación de errores y advertencias, y la inserción de viajeros
  private async handleFileProcessing(
    travelers: FileTravelerDto[],
    coverages: CoverageEntity[],
    countries: CountryEntity[],
    client: ContratorEntity,
    fileName: string,
    user: UserEntity,
    dir?: [string, string, string],
  ): Promise<ResponseErrorOrWarningDto | void> {
    const errors =
      await this.travelerUploadFilesService.validateTravelersErrors(
        travelers,
        coverages,
      );
    if (errors) {
      if (dir) {
        await FileHelper.moveAndOverrideFile(dir[0], dir[1], dir[2]);
      }
      return this.travelerUploadFilesService.bindWarningsAndErrors(
        errors,
        await this.travelerUploadFilesService.validateTravelersWarnings(
          travelers,
          countries,
        ),
      );
    }
    return await this.travelerUploadFilesService.insertTraveler(
      travelers,
      coverages,
      countries,
      client,
      fileName,
      user,
      dir,
    );
  }

  // Método para manejar la eliminación o movimiento del archivo
  private async handleFileCleanup(
    file: Express.Multer.File | string,
    dir?: [string, string, string],
  ): Promise<void> {
    if (typeof file === 'string') {
      //await FileHelper.deletFile(file); // Si es necesario, descomentar
    } else {
      if (dir) {
        await FileHelper.moveAndOverrideFile(dir[0], dir[1], dir[2]);
      } else {
        await FileHelper.deletFile(file.path);
      }
    }
  }

  // Método para procesar un archivo normal
  async processFile(
    file: Express.Multer.File,
    idClient: number,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    const [client, countries, coverages, userEntity] =
      await this.loadCommonData(idClient, user.id);
    const travelers = await this.handleFileContent(file, coverages);

    let [procecedFolder, unprocesedFolder] = await Promise.all([
      (
        await this.configService.findConfigByKEy(
          Configuration.FIlES_PROCESSED_PATH,
        )
      ).value,
      (
        await this.configService.findConfigByKEy(
          Configuration.FIlES_UNPROCESSED_PATH,
        )
      ).value,
    ]);

    procecedFolder = FileHelper.joinPath(procecedFolder, client.file);
    unprocesedFolder = FileHelper.joinPath(unprocesedFolder, client.file);
    const procecedFiles = FileHelper.joinPath(
      procecedFolder,
      file.originalname,
    );
    const unprocesedFiles = FileHelper.joinPath(
      unprocesedFolder,
      file.originalname,
    );

    return await this.handleFileProcessing(
      travelers,
      coverages,
      countries,
      client,
      file.originalname,
      userEntity,
      [procecedFolder, file.path, procecedFiles],
    );
  }

  // Método para procesar un solo archivo
  async processOneFile(
    file: Express.Multer.File,
    idClient: number,
    user: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    const [client, countries, coverages, userEntity] =
      await this.loadCommonData(idClient, user.id);
    const travelers = await this.handleFileContent(file, coverages);

    await FileHelper.deletFile(file.path);

    return await this.handleFileProcessing(
      travelers,
      coverages,
      countries,
      client,
      file.originalname,
      userEntity,
    );
  }

  // Método para procesar un archivo en bulk
  async processBulkFile(
    file: string,
    client: ContratorEntity,
    countries: CountryEntity[],
    coverages: CoverageEntity[],
    userEntity: UserEntity,
  ): Promise<ResponseErrorOrWarningDto | void> {
    const travelers = await this.handleFileContent(file, coverages);

    const fileName = FileHelper.getFileName(file);

    return await this.handleFileProcessing(
      travelers,
      coverages,
      countries,
      client,
      fileName,
      userEntity,
    );
  }
  log(message: string, level = 'info') {
    this.loggingService.create({
      message,
      context: 'File Upload Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
}
