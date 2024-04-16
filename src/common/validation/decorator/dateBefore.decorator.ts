import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateBefore(
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

@ValidatorConstraint({ name: 'IsDateBefore' })
export class ValidateDateBefore implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_before = (args.object as Date)[date_start];
    return dayjs(value).isBefore(dayjs(date_before));
  }

  defaultMessage(args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_before = (args.object as Date)[date_start];
    return '$property no es anterior a la fecha :' + date_before.toString();
  }
}
