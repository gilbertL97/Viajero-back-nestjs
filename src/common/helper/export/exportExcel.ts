import * as ExcelJS from 'exceljs';
import { Columns } from './utils/types/columnsTypes';
import { flater } from './utils/methods/utils';

export async function exportExcel(
  data: any[],
  columns: Columns[],
  title: string,
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);
  worksheet.columns = columns;
  const dat = data.map((elem: any) => flater(elem));
  //console.log(title, data.value);
  worksheet.addRows(dat);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
