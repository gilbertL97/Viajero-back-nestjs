import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CoverageService } from 'src/coverage/coverage.service';

export function IsValidCoverage(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ValidateIsExistCoverage,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidCoverage' })
export class ValidateIsExistCoverage implements ValidatorConstraintInterface {
  //constructor() {}
  async validate(value: string, args: ValidationArguments) {
   const coverageService = new CoverageService();
    const coverages = await this.coverageService.getCoveragesActives();
    const coverage = coverages.find((c) => c.name == value);
    if (coverage) return true;
    return false;
  }

  defaultMessage() {
    return 'La cobertura no existe por lo tanto no se realizaran los calculos';
  }
}
