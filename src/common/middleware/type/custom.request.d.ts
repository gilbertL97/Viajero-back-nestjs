// custom.d.ts o en un archivo de definición de tipo existente
declare namespace Express {
  export interface Request {
    requestId?: string;
  }
}
