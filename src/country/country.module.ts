import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryEntity } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity], Configuration.POSTGRESCONNECT),
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
