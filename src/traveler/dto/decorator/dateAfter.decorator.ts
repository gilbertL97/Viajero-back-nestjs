import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsDateAfter(
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

@ValidatorConstraint({ name: 'IsDateAfter' })
export class ValidateDateBefore implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_after = (args.object as Date)[date_start];
    return dayjs(value).isAfter(dayjs(date_after));
  }

  defaultMessage(args: ValidationArguments) {
    const [date_start] = args.constraints;
    const date_after = (args.object as Date)[date_start];
    return '$property no es posterior a la fecha :' + date_after.toString();
  }
}
