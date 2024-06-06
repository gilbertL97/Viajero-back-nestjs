import { CustomConfigService } from './../../config/service/config.service';
import { Injectable } from '@nestjs/common';
import { FileHelper } from 'src/common/file/file.helper';
import { Configuration } from 'src/config/config.const';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { TravelerUploadFilesService } from 'src/traveler/service/traveler.upload-files.service';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { ResponseErrorOrWarningDto } from 'src/traveler/dto/responseErrorOrWarning.dto';
import { ExportToTxt } from './exportToTxt';
import { ExternalFilesHelper } from 'src/common/file/externalServiceFiles.helper';
import { CoverageService } from 'src/coverage/coverage.service';
import { CountryService } from 'src/country/country.service';
import { LogginService } from 'src/loggin/loggin.service';

@Injectable()
export class AutoImportFileService {
  constructor(
    private readonly exportToTxt: ExportToTxt,
    private readonly contractorService: ContractorService,
    private readonly coverageService: CoverageService,
    private readonly countryService: CountryService,
    private readonly travelerService: TravelerUploadFilesService,
    private readonly userService: UserService,
    private readonly configService: CustomConfigService,
    private readonly logginService: LogginService,
  ) {}

  //@Cron('* 1 * * * *')
  async autoImportFiles() {
    const userSystem = await this.userService.findUserByName('system'); //usuario del sistema}
    this.saveSystemUserLog(
      'Comenzando la importación de archivos automática a una hora especificada',
      userSystem.id,
    );
    const filesPath = await this.configService.findConfigByKEy(
      Configuration.FILES_PATH,
    );
    const pathToLogs = await this.configService.findConfigByKEy(
      Configuration.FILES_LOGS_PATH,
    );
    const procecedFiles = await this.configService.findConfigByKEy(
      Configuration.FIlES_PROCESSED_PATH,
    );
    const unprocesedFiles = await this.configService.findConfigByKEy(
      Configuration.FIlES_UNPROCESSED_PATH,
    );
    await this.importFiles(
      userSystem,
      filesPath.value,
      pathToLogs.value,
      procecedFiles.value,
      unprocesedFiles.value,
    );
  }
  async manuallyImportFiles(user: UserEntity) {
    this.log(`Ejecutando la importación de archivos automática`);
    const filesPath = await this.configService.findConfigByKEy(
      Configuration.FILES_PATH,
    );
    const pathToLogs = await this.configService.findConfigByKEy(
      Configuration.FILES_LOGS_PATH,
    );
    //guardo en una carpeta temporal para descargar un zip con todos los logs de las carpetas importadas en ese momento
    const tempFile = await this.configService.findConfigByKEy(
      Configuration.TEMP_FILE,
    );
    const procecedFiles = await this.configService.findConfigByKEy(
      Configuration.FIlES_PROCESSED_PATH,
    );
    const unprocesedFiles = await this.configService.findConfigByKEy(
      Configuration.FIlES_UNPROCESSED_PATH,
    );
    await this.importFiles(
      user,
      filesPath.value,
      pathToLogs.value,
      procecedFiles.value,
      unprocesedFiles.value,
      tempFile.value,
    );
    return this.compressFile(tempFile.value);
  }

  private async importFiles(
    user: UserEntity,
    filesPath: string,
    pathToLogs: string,
    procesedFiles: string,
    unprocesedFiles: string,
    pathTemp?: string,
  ) {
    const contractors = await this.contractorService.getContratorsActive();
    // cargo todos los paises clientes y planes en memoria
    const [countries, coverages, userEntity] = await Promise.all([
      this.countryService.findAll(),
      this.coverageService.getCoveragesActives(),
      this.userService.getUser(user.id),
    ]);
    this.log(`Procesamiento de archivos con las rutas de las carpetas en Bd`);
    for (const contractor of contractors) {
      //direcciones de cada carpeta de los contratantes
      const unproceced = FileHelper.joinPath(filesPath, contractor.file);
      const pathLogs = FileHelper.joinPath(pathToLogs, contractor.file);
      const procecedFile = FileHelper.joinPath(procesedFiles, contractor.file);
      const unprocecedFile = FileHelper.joinPath(
        unprocesedFiles,
        contractor.file,
      );
      //obtengo todos los archivos de ese contratante}

      const files = FileHelper.getAllFilesInFolder(unproceced);

      for (const file of files) {
        //uno las direcciones de cada archivo con las direcciones de cada contratante
        const pathFile = FileHelper.joinPath(unproceced, file);
        const pathtoProceced = FileHelper.joinPath(procecedFile, file);
        const pathToUnprocesed = FileHelper.joinPath(unprocecedFile, file);
        // cargo todos los paises clientes y planes en memoria

        //llamo al metodo para cargar viajeros en los archivos
        await this.log(`Procesando archivo:${file}`);
        const log = await this.travelerService.processBulkFile(
          pathFile,
          contractor,
          countries,
          coverages,
          userEntity,
        );

        await this.writeLogs(
          pathLogs,
          file,
          log,
          FileHelper.joinPath(pathTemp, contractor.file),
        );
        if (log && log.containErrors) {
          FileHelper.moveFileAndCreateRoute(
            unprocecedFile,
            pathToUnprocesed,
            pathFile,
          );
        } else {
          FileHelper.moveFileAndCreateRoute(
            procecedFile,
            pathtoProceced,
            pathFile,
          );
        }
      }
    }
  }
  private async compressFile(path: string): Promise<Buffer> {
    const buffer = await ExternalFilesHelper.compressFolder(path);
    this.log(`Comprimiendo archivo para enviar en la ruta: ${path}`);
    this.exportToTxt.deleteAllfolderIntemp(path);
    //FileHelper.deleteDir(path);
    // if(buffer)FileHelper.m
    return buffer;
  }
  private writeLogs(
    path: string,
    filename: string,
    logs: ResponseErrorOrWarningDto | void,
    temp?: string,
  ) {
    this.exportToTxt.insertTableInTxt(logs, path, filename);
    if (temp) this.exportToTxt.insertTableInTxt(logs, temp, filename);
    this.log(`Escribiendo logs :${filename}`);
  }
  async log(message: string, level = 'info') {
    await this.logginService.create({
      message,
      context: 'File Automatic Import Service',
      level,
      createdAt: new Date().toISOString(),
    });
  }
  async saveSystemUserLog(message: string, userid: number, level = 'info') {
    await this.logginService.saveLog({
      message,
      context: 'File Automatic Import Service',
      level,
      createdAt: new Date().toISOString(),
      errorStack: '-',
      userAgent: '-',
      requestId: '-',
      ip: '-',
      method: '',
      url: '-',
      userId: userid,
    });
  }
}
