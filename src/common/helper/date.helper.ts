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
    console.log(
      test,
      initialDate,
      finalDate + 'esto es una prueba haber si entra',
    );
    return test;
  }
  //para saber el estado de de los dias con respecto a hoy
  public static dayState(finalDate: Date) {
    return new Date(finalDate).getTime() - new Date().getTime();
  }
}
