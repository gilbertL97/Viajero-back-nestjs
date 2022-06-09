import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
<<<<<<< HEAD:src/modules/traveler/dto/create-traveler.dto.ts
import { ContratorEntity } from 'src/modules/contractor/entity/contrator.entity';
import { CoverageEntity } from 'src/modules/coverage/entities/coverage.entity';
import { CountryEntity } from '../entity/country.entity';
=======
import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { CountryEntity } from '../../country/entities/country.entity';
>>>>>>> b938de94cb083b6b9b65e8073ebb37fd84214672:src/traveler/dto/create-traveler.dto.ts

export class CreateTravelerDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1)
  sex: string;

  @IsDateString()
  born_date: Date;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  passport: string;

  @IsOptional()
  @IsDateString()
  sale_date: Date;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date_policy: Date;

  @IsOptional()
  @IsNumberString()
  number_high_risk_days: number;

  @IsObject()
  contractor: ContratorEntity;

  @IsOptional()
  @IsObject()
  origin_country: CountryEntity;

  @IsOptional()
  @IsObject()
  nationality: CountryEntity;

  @IsObject()
  coverage: CoverageEntity;
}
