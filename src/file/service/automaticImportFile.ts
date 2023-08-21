import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { FileHelper } from 'src/common/file/file.helper';
import { Configuration } from 'src/config/config.const';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { join } from 'path';
import { TravelerUploadFilesService } from 'src/traveler/service/traveler.upload-files.service';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class AutoImportFileService {
  constructor(
    private readonly contractorService: ContractorService,
    private readonly travelerService: TravelerUploadFilesService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('45 * * * * *')
  async handleCron() {
    console.log('Called when the current second is 45');
    const userSystem = await this.userService.findUserByName('system'); //usuario del sistema}
    await this.importFiles(userSystem);
  }
  async importFiles(user: UserEntity) {
    const contractors = await this.contractorService.getContratorsActive();
    const path = this.configService.get(Configuration.FILES_PATH);
    for (const contractor of contractors) {
      //direcciones de cada carpeta de los contratantes
      const pathContractor = join(path, contractor.file);
      //obtengo todos los archivos de ese contratante
      const files = FileHelper.getAllFilesInFolder(pathContractor);

      for (const file of files) {
        //this.travelerService.processBulkFile
        const pathFile = join(pathContractor, file);
        console.log(pathFile);
        const log = await this.travelerService.processBulkFile(
          pathFile,
          contractor,
          user,
        );
        console.log(log);
      }
    }
  }
}
