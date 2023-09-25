import * as ExcelJS from 'exceljs';
import { ColumnsExcel } from './utils/types/columnsTypes';
import { flater } from './utils/methods/utils';

export async function exportExcel(
  data: any[],
  columns: ColumnsExcel[],
  title: string,
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);
  worksheet.columns = columns;
  const dat = data.map((elem: any) => flater(elem));
  worksheet.addRows(dat);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
