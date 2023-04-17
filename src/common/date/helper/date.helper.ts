import * as dayjs from 'dayjs';

export class DateHelper {
  public static timeDifference(initialDate: Date, finalDate: Date) {
    return Math.abs(
      new Date(initialDate).getTime() - new Date(finalDate).getTime(),
    );
  }

  public static daysDifference(initialDate: Date, finalDate: Date) {
    const test = Math.ceil(
      this.timeDifference(initialDate, finalDate) /
        (1000 * // milisegundos
          60 * //,segundos
          60 * //, minutos
          24), // , horas
    );
    return test;
  }
  //para saber el estado de de los dias con respecto a hoy
  public static dayState(finalDate: Date) {
    return new Date(finalDate).getTime() - new Date().getTime();
  }
  public static dayStateBoolean(finalDate: Date) {
    //console.log(dayjs(finalDate).diff(dayjs(new Date()), 'days'));
    return dayjs(finalDate).diff(dayjs(new Date()), 'days') >= 0;
  }
  public static daysDifferenceWithDaysjs(initialDate: Date, finalDate: Date) {
    const start = dayjs(initialDate, 'DD-MM-YYYY');
    const end = dayjs(finalDate, 'DD-MM-YYYY');
    return end.diff(start, 'day'); //el numero de dias es la diferencia mas un dia
  }
}
