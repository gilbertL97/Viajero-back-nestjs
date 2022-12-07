import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';
import { DateHelper } from 'src/common/date/helper/date.helper';

export function CalculateNumberOfDays(
  date_start: string,
  date_end: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [date_start, date_end],
      validator: CompareWithDates,
    });
  };
}

@ValidatorConstraint({ name: 'CalculateNumberOfDays' })
export class CompareWithDates implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [date_start, date_end] = args.constraints;
    const dateEnd = (args.object as Date)[date_end];
    const dateInit = (args.object as Date)[date_start];
    const diff = DateHelper.daysDifferenceWithDaysjs(dateInit, dateEnd) + 1; //Calculo de los dias mas uno ;
    return value == diff;
  }

  defaultMessage() {
    return 'El calculo de los numeros de dias no es correcto';
  }
}
