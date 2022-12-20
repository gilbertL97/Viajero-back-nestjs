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
      traveler.number_high_risk_days = isFormula(rows[13]); //'DIAS ACTIVIDAD ALTO RIESGO ' + rows[13]
      traveler.number_days = isFormula(rows[14]); //'CANTIDAD DIAS' + rows[14]
      traveler.amount_days_high_risk = isFormula(rows[15]); //'IMPORTE DIAS ALTO RIESGO ' + rows[15]
      traveler.amount_days_covered = isFormula(rows[16]); //'IMPORTE DIAS CUBIERTOS ' + rows[16])
      traveler.total_amount = isFormula(rows[17]);
      console.log(
        traveler.number_high_risk_days,
        traveler.number_days,
        traveler.amount_days_high_risk,
        traveler.total_amount,
      ); //IMPORTE TOTAL ' + rows[17]
      travelers.push(traveler);
    });
    return travelers;
  }
}
function isFormula(row: any): number {
  // verifico q no tengan formula ni null ni nada
  if (typeof row === 'number') return row;
  if (typeof row === 'undefined') return 0;
  if (row.result) return row.result;
  return 0;
}
