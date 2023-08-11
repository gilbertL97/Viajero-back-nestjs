import { FileErrorsTravelerDto } from './fileErrorsTravelers.dto';

export class ResponseErrorOrWarningDto {
  constructor(error: FileErrorsTravelerDto[], isError: boolean) {
    this.errorAndWarning = error;
    this.containErrors = isError;
  }
  errorAndWarning: FileErrorsTravelerDto[];
  containErrors: boolean;
}
