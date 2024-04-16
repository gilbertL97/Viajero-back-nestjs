import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsCustomDateBefore(
  date_before: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [date_before],
      validator: ValidateDateBefore,
    });
  };
}

@ValidatorConstraint({ name: 'IsCustomDateBefore' })
export class ValidateDateBefore implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_before = (args.object as Date)[date_start];
    return dayjs(value, 'DD/MM/YYYY').isBefore(
      dayjs(date_before, 'DD/MM/YYYY'),
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_before = (args.object as Date)[date_start];
    return '$property no es anterior a la fecha :' + date_before.toString();
  }
}
