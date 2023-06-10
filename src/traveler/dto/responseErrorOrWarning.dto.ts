import { FileErrorsTravelerDto } from './fileErrorsTravelers.dto';

export class ResponseErrorOrWarningDto {
  errorAndWarning: FileErrorsTravelerDto[];
  containErrors: boolean;
}
