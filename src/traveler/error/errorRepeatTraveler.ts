export class RepeatTravelerError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    //Captura del stack trace del error que ocurrió en la base de datos
    Error.captureStackTrace(this, this.constructor);
  }
}
