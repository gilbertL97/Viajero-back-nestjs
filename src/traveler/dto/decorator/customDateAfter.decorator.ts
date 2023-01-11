import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateAfter(
  date_after: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [date_after],
      validator: ValidateDateIsDateAfter,
    });
  };
}

@ValidatorConstraint({ name: 'IsDateAfter' })
export class ValidateDateIsDateAfter implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_after = (args.object as Date)[date_start];
    return dayjs(value, 'DD/MM/YYYY').isAfter(dayjs(date_after, 'DD/MM/YYYY'));
  }

  defaultMessage(args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_after = (args.object as Date)[date_start];
    return '$property no es posterior a la fecha :' + date_after;
  }
}
