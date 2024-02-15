import { CoverageEntity } from 'src/coverage/entities/coverage.entity';
import { ValidateFile } from 'src/traveler/helper/validation.file';

describe('Validation : clase para validar ', () => {
  const fileCsv = {
    path: 'C:/Users/gilbert.luis/Desktop/Viajero/ficheros viajeros/ficheros/Sweet20230810-72.xlsx',
    mimetype: 'text/csv',
  } as Express.Multer.File;
  const fileExcel = {
    path: 'C:/Users/gilbert.luis/Desktop/Viajero/ficheros viajeros/ficheros/bloqueado/HolaSun_202311192.csv',
    mimetype:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  } as Express.Multer.File;

  it('Debe decir que el archvios es csv', async () => {
    const result = ValidateFile.isCSV(fileCsv);
    // Aquí esperarías que result fuera true ya que el archivo es CSV
    expect(result).toBeTruthy();
  });

  it('Debe decir que el archvios es excel ', async () => {
    const result = await ValidateFile.isExcel(fileExcel);
    // Aquí esperarías que result fuera true ya que el archivo es excel
    expect(result).toBeTruthy();
  });
  it('Debe decir que el archvios no es csv', async () => {
    fileCsv.mimetype = 'test';
    const result = ValidateFile.isCSV(fileCsv);
    // Aquí esperarías que result fuera false ya que el archivo es CSV
    expect(result).toBeFalsy();
  });

  it('Debe decir que el archvios no es excel ', async () => {
    fileExcel.mimetype = 'test';
    const result = await ValidateFile.isExcel(fileExcel);
    // Aquí esperaroque result fuera false ya que el archivo es excel
    expect(result).toBeFalsy();
  });
});
