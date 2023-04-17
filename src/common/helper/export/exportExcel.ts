import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import * as ExcelJS from 'exceljs';
import dayjs from 'dayjs';

type Columns = {
  header: string;
  key: string;
};
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

const flater = (elem: any) => {
  const keys = Object.keys(elem);
  const element = elem;
  keys.forEach((key) => {
    typeof elem[key] == 'object'
      ? (element[key] = getName(elem[key]))
      : (element[key] = elem[key]);
  });
  return element;
};
const getName = (elem: any) => {
  if (elem instanceof TravelerEntity) return elem.name;
  if (elem instanceof CoverageEntity) return elem.name;
  if (elem instanceof CountryEntity) return elem.comun_name;
  if (elem instanceof ContratorEntity) return elem.client;
  if (elem instanceof Date) {
    return dayjs(elem).format('DD/MM/YYYY');
  }
};
