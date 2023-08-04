import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AutoImportFileService {
  @Cron('0 2 * * *')
  handleCron() {
    console.log('Called every day at 2 AM');
  }
}
