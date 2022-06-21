export class DateHelper {
  public static timeDifference(initialDate: Date, finalDate: Date) {
    return Math.abs(
      new Date(initialDate).getTime() - new Date(finalDate).getTime(),
    );
  }

  public static daysDifference(initialDate: Date, finalDate: Date) {
    const test = Math.ceil(
      this.timeDifference(initialDate, finalDate) / (1000 * 60 * 60 * 24), // milisegundos ,segundos, minutos , horas
    );
    console.log(test, initialDate, finalDate);
    return test;
  }
  public static timeDifferenceAux(initialDate: Date, finalDate: Date) {
    return new Date(initialDate).getTime() - new Date(finalDate).getTime();
  }
  public static daysDifferenceAux(initialDate: Date, finalDate: Date) {
    const test =
      this.timeDifference(initialDate, finalDate) / (1000 * 60 * 60 * 24); // milisegundos ,segundos, minutos , horas
    console.log(test, initialDate, finalDate);
    return test;
  }
}
