import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { FileHelper } from 'src/common/file/file.helper';
import { Configuration } from 'src/config/config.const';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { TravelerUploadFilesService } from 'src/traveler/service/traveler.upload-files.service';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { ResponseErrorOrWarningDto } from 'src/traveler/dto/responseErrorOrWarning.dto';
import { ExportToTxt } from './exportToTxt';
import { ExternalFilesHelper } from 'src/common/file/externalServiceFiles.helper';

@Injectable()
export class AutoImportFileService {
  constructor(
    private readonly exportToTxt: ExportToTxt,
    private readonly contractorService: ContractorService,
    private readonly travelerService: TravelerUploadFilesService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('45 * * * * *')
  async autoImportFiles() {
    console.log('Called when the current second is 45');
    const userSystem = await this.userService.findUserByName('system'); //usuario del sistema}
    const pathUnprocess = this.configService.get(Configuration.FILES_PATH);
    const pathToLogs = this.configService.get(Configuration.FILES_LOGS_PATH);
    await this.importFiles(userSystem, pathUnprocess, pathToLogs);
  }
  async manuallyImportFiles(user: UserEntity) {
    const pathUnprocess = this.configService.get(Configuration.FILES_PATH);
    //guardo en una carpeta temporal para descargar un zip con todos los logs de las carpetas importadas en ese momento
    const tempFile = this.configService.get(Configuration.TEMP_FILE);
    await this.importFiles(user, pathUnprocess, tempFile);
    return this.compressFile(tempFile);
  }

  private async importFiles(
    user: UserEntity,
    pathUnprocess: string,
    pathToLogs: string,
  ) {
    const contractors = await this.contractorService.getContratorsActive();
    for (const contractor of contractors) {
      //direcciones de cada carpeta de los contratantes
      const unproceced = FileHelper.joinPath(pathUnprocess, contractor.file);
      const pathLogs = FileHelper.joinPath(pathToLogs, contractor.file);
      //obtengo todos los archivos de ese contratante}
      const files = FileHelper.getAllFilesInFolder(unproceced);
      for (const file of files) {
        //uno las direcciones de cada archivo con las direcciones de cada contratante
        const pathFile = FileHelper.joinPath(unproceced, file);
        //llamo al metodo para cargar viajeros en los archivos
        const log = await this.travelerService.processBulkFile(
          pathFile,
          contractor,
          user,
        );
        this.writeLogs(pathLogs, file, log);
      }
    }
  }
  private async compressFile(path: string): Promise<Buffer> {
    const buffer = await ExternalFilesHelper.compressFolder(path);
    // if(buffer)FileHelper.m
    return buffer;
  }
  private writeLogs(
    path: string,
    filename: string,
    logs: ResponseErrorOrWarningDto | void,
  ) {
    this.exportToTxt.insertTableInTxt(logs, path, filename);
  }
}
