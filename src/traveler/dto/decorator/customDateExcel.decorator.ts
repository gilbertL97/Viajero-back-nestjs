import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateFile(validationOptions?: ValidationOptions) {
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

@ValidatorConstraint({ name: 'IsDateFile' })
export class ValidateDates implements ValidatorConstraintInterface {
  validate(value: Date) {
    //console.log(value, dayjs(value, 'dd/mm/yyyy').isValid());
    return dayjs(value, 'DD/MM/YYYY', 'es', true).isValid();
  }

  defaultMessage() {
    return 'Formato de fecha invalido ';
  }
}
