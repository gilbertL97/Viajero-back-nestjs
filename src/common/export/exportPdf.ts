import { ColumnsExcel, ColumnsPdf } from './utils/types/columnsTypes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const PDFDocument = require('pdfkit-table');
import PDFDocument from 'pdfkit-table';
import { flater } from './utils/methods/utils';
export async function exportPdf(
  data: any[],
  columns: ColumnsPdf[],
  title: string,
): Promise<Uint8Array> {
  const pantoneColor = '#1b1462';
  const pdfBuffer: Buffer = await new Promise((resolve) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      bufferPages: true,
      autoFirstPage: false,
    });
    let pageNumber = 0;
    doc.on('pageAdded', () => {
      pageNumber++;
      const bottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.font('Helvetica').fontSize(14);
      //
      doc.text(
        //para colocar el paginado al final del doc y en el centro
        'Pág. ' + pageNumber,
        0.5 * (doc.page.width - 100),
        doc.page.height - 50,
        {
          width: 100,
          align: 'center',
          lineBreak: false,
        },
      );
      doc.page.margins.bottom = bottom;
      doc.image('assets/esicubaLogo.jpg', doc.page.width / 2 - 50, 25, {
        scale: 0.15,
      });
      doc.text('', 0, 100);
      doc.font('Helvetica-Bold').fontSize(20).fillColor(pantoneColor);
      doc.text(title, {
        width: doc.page.width,
        align: 'center',
      });
    });
    console.log(data);
    const table = {
      title: 'Tabla' + title,
      headers: columns,
      datas: data.map((elem: any) => flater(elem)),
    };
    doc.addPage();
    doc.table(table);
    const buffer = [];
    doc.on('data', buffer.push.bind(buffer));
    doc.on('end', () => {
      const data = Buffer.concat(buffer);
      resolve(data);
    });
    doc.end();
  });
  /*const pdfDoc = await PDFDocument.load(pdfBuffer);*/
  return pdfBuffer;
}
