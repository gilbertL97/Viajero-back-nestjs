import { IsNotEmpty, Length } from 'class-validator';

export class CreateConfigDto {
  @IsNotEmpty()
  @Length(5, 100)
  key: string;

  @IsNotEmpty()
  @Length(5, 100)
  value: string;
}
