import { FileTravelerDto } from '../dto/file-traveler.dto';
import Excel = require('exceljs');
export class ExcelJSCOn {
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
  static isFormula(row: any): number {
    // verifico q no tengan formula ni null ni nada
    if (typeof row === 'number') return row;
    if (typeof row === 'undefined') return 0;
    if (row.result) return row.result;
    return 0;
  }
  static parseTraveler(r: Excel.Row): FileTravelerDto {
    const traveler = new FileTravelerDto();
    const rows = r.values;
    traveler.name = rows[1]; //Titular ' + rows[1]);
    traveler.sex = rows[2]; //'Sexo ' + rows[2]
    traveler.born_date = rows[3]; //'Fecha de Nacimiento ' + rows[3]
    traveler.email = rows[4]; //'Correo Electrónico ' + rows[4]
    traveler.passport = rows[5]; //'PASAPORTE ' + rows[5]
    traveler.origin_country = rows[6]; //'PAIS ORIGEN ' + rows[6]
    traveler.nationality = rows[7]; //'NACIONALIDAD ' + rows[7]
    traveler.flight = rows[8]; //'VUELO ' + rows[8]
    traveler.coverage = rows[9]; //'TIPO COBERTURA ' + rows[9]
    traveler.sale_date = rows[10]; //'FECHA DE VENTA ' + rows[10]
    traveler.start_date = rows[11]; //'FECHA DE INICIO ' + rows[11]
    traveler.end_date_policy = rows[12]; //'FECHA DE FIN DE POLIZA ' + rows[12]
    traveler.number_high_risk_days = this.isFormula(rows[13]); //'DIAS ACTIVIDAD ALTO RIESGO ' + rows[13]
    traveler.number_days = this.isFormula(rows[14]); //'CANTIDAD DIAS' + rows[14]
    traveler.amount_days_high_risk = this.isFormula(rows[15]); //'IMPORTE DIAS ALTO RIESGO ' + rows[15]
    traveler.amount_days_covered = this.isFormula(rows[16]); //'IMPORTE DIAS CUBIERTOS ' + rows[16])
    traveler.total_amount = this.isFormula(rows[17]);
    console.log(traveler.passport, typeof traveler.passport); //IMPORTE TOTAL ' + rows[17]
    return traveler;
  }
  static testParseTraveler(r: Excel.Row): FileTravelerDto {
    const traveler = new FileTravelerDto();
    const rows = r.values;
    traveler.name = this.isEmptyString(r.getCell(1).text); //Titular ' + this.isEmptyString(r.getCell(1]);
    traveler.sex = this.isEmptyString(r.getCell(2).text); //'Sexo ' + this.isEmptyString(r.getCell(2).text
    traveler.born_date = this.isEmptyString(r.getCell(3).text); //'Fecha de Nacimiento ' + this.isEmptyString(r.getCell(3).text
    traveler.email = this.isEmptyString(r.getCell(4).text); //'Correo Electrónico ' + this.isEmptyString(r.getCell(4).text
    traveler.passport = this.isEmptyString(r.getCell(5).text); //'PASAPORTE ' + this.isEmptyString(r.getCell(5).text
    traveler.origin_country = this.isEmptyString(r.getCell(6).text); //'PAIS ORIGEN ' + this.isEmptyString(r.getCell(6).text
    traveler.nationality = this.isEmptyString(r.getCell(7).text); //'NACIONALIDAD ' + this.isEmptyString(r.getCell(7).text
    traveler.flight = this.isEmptyString(r.getCell(8).text); //'VUELO ' + this.isEmptyString(r.getCell(8).text
    traveler.coverage = this.isEmptyString(r.getCell(9).text); //'TIPO COBERTURA ' + this.isEmptyString(r.getCell(9).text
    traveler.sale_date = this.isEmptyString(r.getCell(10).text); //'FECHA DE VENTA ' + this.isEmptyString(r.getCell(10)) ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined ?? undefined
    traveler.start_date = this.isEmptyString(r.getCell(11).text); //'FECHA DE INICIO ' + this.isEmptyString(r.getCell(11).text
    traveler.end_date_policy = this.isEmptyString(r.getCell(12).text); //'FECHA DE FIN DE POLIZA ' + this.isEmptyString(r.getCell(12).text
    traveler.number_high_risk_days = this.isFormula(rows[13]); //'DIAS ACTIVIDAD ALTO RIESGO ' + row[13).text
    traveler.number_days = this.isFormula(rows[14]); //'CANTIDAD DIAS' + row[14]
    traveler.amount_days_high_risk = this.isFormula(rows[15]); //'IMPORTE DIAS ALTO RIESGO ' + row[15]
    traveler.amount_days_covered = this.isFormula(rows[16]); //'IMPORTE DIAS CUBIERTOS ' + row[16])
    traveler.total_amount = this.isFormula(rows[17]); //IMPORTE TOTAL ' + this.isEmptyString(r.getCell(17]
    //console.log(traveler.start_date, traveler.end_date_policy);
    return traveler;
  }
  static isEmptyString(ch: string): string | undefined {
    const value = ch.length == 0 ? undefined : ch;
    return value;
  }
}
