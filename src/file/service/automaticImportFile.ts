import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { FileHelper } from 'src/common/file/file.helper';
import { Configuration } from 'src/config/config.const';
import { ContractorService } from 'src/contractor/service/contractor.service';
import { join } from 'path';

@Injectable()
export class AutoImportFileService {
  constructor(
    private readonly contractorService: ContractorService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('45 * * * * *')
  async handleCron() {
    console.log('Called every day at 2 AM');
    const folderList = (await this.contractorService.getContratorsActive()).map(
      (con) => con.file,
    );
    const path = this.configService.get(Configuration.FILES_PATH);
    const allFiles = FileHelper.getAllFilesInFolder(path);
    console.log(join(path, 'Daiquiri'));
  }
  @Cron('0 2 * * *')
  handleCron45() {
    console.log('Called when the current second is 45');
  }
}
