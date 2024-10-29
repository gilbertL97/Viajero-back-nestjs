import * as dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
import { ConfigType } from 'dayjs';
import Excel from 'exceljs';

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
  public static dayStateBoolean(date: Date) {
    return (
      dayjs(date).diff(dayjs(new Date()), 'days') >= 0 && //q fecha fin mayor q hoy
      dayjs(new Date()).diff(dayjs(date), 'days') <= 0 //fecha inicio menor q hoy
    );
  }
  public static daysDifferenceWithDaysjs(initialDate: Date, finalDate: Date) {
    const start = dayjs(initialDate, 'DD-MM-YYYY');
    const end = dayjs(finalDate, 'DD-MM-YYYY');
    return end.diff(start, 'day'); //el numero de dias es la diferencia mas un dia
  }
  public static getMonthByDate(date: Date) {
    // Array con los nombres de los meses en español
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    // Devolver el nombre del mes correspondiente al número ingresado
    return meses[dayjs(date).month()];
  }

  public static getFirstDateOfYear(date: Date) {
    return dayjs(date).set('month', 0).set('dates', 1).format('YYYY-MM-DD');
  }
  public static getLastDateOfYear(date: Date) {
    return dayjs(date).set('month', 11).set('dates', 31).format('YYYY-MM-DD');
  }

  //Format Dates
  public static getFormatedDateYYYYMMDD(date: ConfigType) {
    return dayjs(date).format('YYYY-MM-DD');
  }
  public static getFormatedDateDDMMYYYY(date: ConfigType) {
    return dayjs(date).format('DD/MM/YYYY');
  }
}
