import { ContratorEntity } from 'src/contractor/entity/contrator.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { TravelerEntity } from 'src/traveler/entity/traveler.entity';
import * as ExcelJS from 'exceljs';
import * as dayjs from 'dayjs';
import { FileEntity } from 'src/file/entities/file.entity';

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
    if (typeof elem[key] == 'object') {
      element[key] = getName(elem[key]);
    }
    // : (element[key] = elem[key]);
    else
      elem[key]
        ? (element[key] = tranformDate(elem[key], key))
        : (element[key] = elem[key]);
  });
  return element;
};
const getName = (elem: any) => {
  if (elem instanceof TravelerEntity) return elem.name;
  if (elem instanceof CoverageEntity) return elem.name;
  if (elem instanceof CountryEntity) return elem.comun_name;
  if (elem instanceof ContratorEntity) return elem.client;
  if (elem instanceof FileEntity) return elem.name;
};
function tranformDate(elem: any, key: string) {
  if (
    key == 'born_date' ||
    key == 'sale_date' ||
    key == 'sale_date' ||
    key == 'start_date' ||
    key == 'end_date_policy' ||
    key == 'created_at'
  )
    return dayjs(elem[key]).format('DD/MM/YYYY');
  return elem;
}
