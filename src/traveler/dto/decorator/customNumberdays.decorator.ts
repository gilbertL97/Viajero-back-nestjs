import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

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
    const diff = CompareWithDates.daysDifference(dateInit, dateEnd);
    return value == diff;
  }
  public static daysDifference(initialDate: Date, finalDate: Date) {
    const start = dayjs(initialDate, 'DD-MM-YYYY');
    const end = dayjs(finalDate, 'DD-MM-YYYY');
    return end.diff(start, 'day') + 1; //el numero de dias es la diferencia mas un dia
  }
  defaultMessage() {
    return 'El calculo de los numeros de dias no es correcto';
  }
}
