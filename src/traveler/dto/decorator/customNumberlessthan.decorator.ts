import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

export function IsNumberLessThan(
  prop: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [prop],
      validator: ValidateLessThanNumber,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidDateFile' })
export class ValidateLessThanNumber implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const [majorNumber] = args.constraints;
    const major_number: number = (args.object as unknown as number)[
      majorNumber
    ];
    console.log(value, major_number);
    return value <= major_number;
  }

  defaultMessage() {
    return '$property es mayor que $value';
  }
}
