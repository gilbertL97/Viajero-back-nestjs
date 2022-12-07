import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsValidDateFile(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [propertyName],
      validator: ValidateDates,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidDateFile' })
export class ValidateDates implements ValidatorConstraintInterface {
  validate(value: Date) {
    return dayjs(value, 'DD/MM/YYYY', true).isValid();
  }

  defaultMessage() {
    return 'El formato de Fecha no es valido ';
  }
}
