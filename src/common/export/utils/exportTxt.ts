import { FileHelper } from "src/common/file/file.helper";
import { table } from 'table';


//culmianr esta funcion
export async function exportTxt(columns:string[],data:string[][], filename:string,path:string,subtitle?:string,){


          const dataArray = logs.errorAndWarning.map((item) =>
        this.objectValuesInOrder(item, columns),
      );
      const headeer = this.headers(columns);
      const tableData = [header, ...data];


            FileHelper.createTxtBuffer()
              table(tableData) + subtitle,
              filename,
              path,
            );

}

  function objectValuesInOrder(
    obj: any,
    columns: { key: string; header: string }[],
  ): any[] {
    return columns.map((column) => obj[column.key] || '');
  }

   function headers(columns: { key: string; header: string }[]) {
    return columns.map((column) => column.header);
  }


