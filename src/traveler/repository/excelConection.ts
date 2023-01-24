import { FileTravelerDto } from '../dto/file-traveler.dto';
import Excel = require('exceljs');
import dayjs = require('dayjs');
export class ExcelJSCOn {
  static async getTravelerByFile(file: Express.Multer.File) {
    if (file.mimetype.match(/\/(csv)$/)) return this.getTravelerByCSV(file);
    return this.getTravelerByExcel(file);
  }
  static async getTravelerByExcel(
    file: Express.Multer.File,
  ): Promise<FileTravelerDto[]> {
    const travelers: FileTravelerDto[] = [];
    const workbook = new Excel.Workbook();
    const excel = await workbook.xlsx.readFile(file.path);
    const worksheet = excel.getWorksheet(1);
    worksheet.spliceRows(1, 1); //elimino la primera fila que es la de los encabezados
    worksheet.eachRow(async (r) => {
      const traveler = this.testParseTraveler(r);
      travelers.push(traveler);
    });
    return travelers;
  }
  static async getTravelerByCSV(file: Express.Multer.File) {
    const travelers: FileTravelerDto[] = [];
    const workbook = new Excel.Workbook();
    const csv = await workbook.csv.readFile(file.path);
    csv.spliceRows(1, 1); //elimino la primera fila que es la de los encabezados
    csv.eachRow(async (r) => {
      const traveler = this.testParseTraveler(r);
      travelers.push(traveler);
    });
    return travelers;
  }

  static testParseTraveler(r: Excel.Row): FileTravelerDto {
    const traveler = new FileTravelerDto();
    traveler.name = this.isEmptyString(r.getCell(1).text); //Titular ' + this.isEmptyString(r.getCell(1]);
    traveler.sex = this.isEmptyString(r.getCell(2).text); //'Sexo ' + this.isEmptyString(r.getCell(2).text
    traveler.born_date = this.isDate(r.getCell(3)); //'Fecha de Nacimiento ' + this.isEmptyString(r.getCell(3).text
    traveler.email = this.isEmptyString(r.getCell(4).text); //'Correo Electrónico ' + this.isEmptyString(r.getCell(4).text
    traveler.passport = this.isEmptyString(r.getCell(5).text); //'PASAPORTE ' + this.isEmptyString(r.getCell(5).text
    traveler.origin_country = this.isEmptyString(r.getCell(6).text); //'PAIS ORIGEN ' + this.isEmptyString(r.getCell(6).text
    traveler.nationality = this.isEmptyString(r.getCell(7).text); //'NACIONALIDAD ' + this.isEmptyString(r.getCell(7).text
    traveler.flight = this.isEmptyString(r.getCell(8).text); //'VUELO ' + this.isEmptyString(r.getCell(8).text
    traveler.coverage = this.isEmptyString(r.getCell(9).text); //'TIPO COBERTURA ' + this.isEmptyString(r.getCell(9).text
    traveler.sale_date = this.isDate(r.getCell(10)); //'FECHA DE VENTA ' + this.isEmptyString(r.getCell(10)) ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined
    traveler.start_date = this.isDate(r.getCell(11)); ////traveler.start_date = this.isEmptyString(r.getCell(11).text); //'FECHA DE INICIO ' + this.isEmptyString(r.getCell(11).text
    traveler.end_date_policy = this.isDate(r.getCell(12)); //'FECHA DE FIN DE POLIZA ' + this.isEmptyString(r.getCell(12).text
    traveler.number_high_risk_days = this.isFormula(r.values[13]); //'DIAS ACTIVIDAD ALTO RIESGO ' + row[13).text
    traveler.number_days = this.isFormula(r.values[14]); //'CANTIDAD DIAS' + row[14]
    traveler.amount_days_high_risk = this.isFormula(r.values[15]); //'IMPORTE DIAS ALTO RIESGO ' + row[15]
    traveler.amount_days_covered = this.isFormula(r.values[16]); //'IMPORTE DIAS CUBIERTOS ' + row[16])
    traveler.total_amount = this.isFormula(r.values[17]); //IMPORTE TOTAL ' + this.isEmptyString(r.getCell(17]

    return traveler;
  }
  static isEmptyString(ch: string): string | undefined {
    const value = ch.length == 0 ? undefined : ch;
    return value;
  }
  static isDate(date: Excel.Cell): string | undefined {
    const newDate = this.isEmptyString(date.text);
    if (!newDate) return undefined;
    if (newDate[2] == '/') return newDate;
    return dayjs(newDate).format('DD/MM/YYYY');
  }
  static isFormula(row: any): number {
    // verifico q no tengan formula ni null ni nada
    if (typeof row === 'number') return row;
    if (typeof row === 'undefined') return 0;
    if (row.result) return row.result;
    if (typeof row === 'string' && row.startsWith('$')) return +row.slice(1);
    if (typeof row === 'string') return +row;
    return 0;
  }
}
