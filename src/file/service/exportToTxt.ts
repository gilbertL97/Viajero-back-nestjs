import { Injectable } from '@nestjs/common';
import { FileErrorsTravelerDto } from 'src/traveler/dto/fileErrorsTravelers.dto';
import { ResponseErrorOrWarningDto } from 'src/traveler/dto/responseErrorOrWarning.dto';
import { table } from 'table';
import { FileHelper } from 'src/common/file/file.helper';
//require table from table

@Injectable()
export class ExportToTxt {
  deleteAllfolderIntemp(path: string) {
    const routes = FileHelper.getAllFilesInFolder(path);
    routes.map((rou) => {
      FileHelper.deleteDir(FileHelper.joinPath(path, rou));
    });
  }
  insertTableInTxt(
    logs: ResponseErrorOrWarningDto | void,
    path: string,
    filename: string,
  ) {
    if (logs) {
      const columns = [
        { key: 'row', header: 'Fila' },
        { key: 'name', header: 'Nombre' },
        {
          key: 'contractor',
          header: 'Cliente',
        },
        { key: 'sex', header: 'Sexo' },
        { key: 'born_date', header: 'Fecha de Nacimiento' },
        { key: 'email', header: 'Correo' },

        { key: 'passport', header: 'Pasaporte' },

        { key: 'flight', header: 'Vuelo' },
        { key: 'sale_date', header: 'Fecha de Venta' },

        { key: 'start_date', header: 'Fecha de Inicio' },

        { key: 'end_date_policy', header: 'Fecha de Fin de Viaje' },

        {
          key: 'number_high_risk_days',
          header: 'Numero de dias Alto Riesgo',
        },

        { key: 'number_days', header: 'Cantidad de Dias', type: 'number' },

        {
          key: 'amount_days_high_risk',
          header: 'Monto de dias de alto riesgo',
        },

        {
          key: 'amount_days_covered',
          header: 'Monto de dias cubiertos',
        },

        { key: 'total_amount', header: 'Monto total' },

        { key: 'state', header: 'Estado' },

        { key: 'contractor', header: 'Cliente' },

        { key: 'origin_country', header: 'Pais origen' },

        { key: 'file', header: 'Fichero' },

        { key: 'nationality', header: 'Nacionalidad' },

        { key: 'coverage', header: 'Cobertura' },
      ];
      const dataArray = logs.errorAndWarning.map((item) =>
        this.objectValuesInOrder(item, columns),
      );
      const headeer = this.headers(columns);
      const tableData = [headeer, ...dataArray];
      const isOnlyWarn = logs.containErrors
        ? 'Contiene errores Y Advertencias'
        : 'Solo Contiene Advertencias';
      const logName = logs.containErrors ? 'LOG_ERROR_' : 'LOG_ADVERTENCIA_';

      FileHelper.writeIntxt(
        table(tableData) + isOnlyWarn,
        logName + filename,
        path,
      );
    } else {
      const log = 'LOG_OK_';
      const descrp = 'Fichero Importado sin Advertencias ni Errores';
      FileHelper.writeIntxt(descrp, log + filename, path);
    }
  }

  private objectValuesInOrder(
    obj: FileErrorsTravelerDto,
    columns: { key: string; header: string }[],
  ): any[] {
    return columns.map((column) => obj[column.key] || '');
  }
  private headers(columns: { key: string; header: string }[]) {
    return columns.map((column) => column.header);
  }
}
