import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelerRepository } from '../repository/traveler.repository';
import * as PDF from 'pdfkit';
import * as fs from 'fs';

import { TravelerEntity } from '../entity/traveler.entity';
import { PDFDocument } from 'pdf-lib';
import { join } from 'path';
import { FileHelper } from 'src/common/file/file.helper';

@Injectable()
export class TravelerPdfService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
  ) {}

  async generateCerticate(traveler: TravelerEntity): Promise<Uint8Array> {
    const pantoneColor = '#1b1462';
    const blackColor = 'black';
    const font = 'Helvetica';
    const fontBold = 'Helvetica-Bold';
    const timeFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const days = new Number(traveler.coverage.number_of_days);
    const time = traveler.coverage.daily
      ? new Number(traveler.number_days).toString() + ' días'
      : days.toString() + ' días';
    const price =
      new Number(traveler.coverage.price).toPrecision(6) +
      ' x ' +
      days.toString();
    const templatePrice = traveler.coverage.daily
      ? ' USD ' +
        new Number(traveler.coverage.price).toPrecision(3) +
        ' pax/día x ' +
        time
      : 'USD ' + price + ' días';

    const total = traveler.coverage.daily
      ? new Number(traveler.total_amount).toPrecision(3)
      : days.toPrecision(3);
    const highRisk =
      traveler.coverage.high_risk <= 0
        ? '-'
        : 'USD' +
          new Number(traveler.coverage.high_risk).toPrecision(3) +
          ' pax/día x ' +
          new Number(traveler.number_high_risk_days).toString() +
          ' días';
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDF({
        size: 'LETTER',
        bufferPages: true,
      });
      doc
        .fillColor(pantoneColor)
        .font(fontBold)
        .fontSize(15)
        .text('SEGURO DE ASISTENCIA AL VIAJERO (VIAJES IN)');
      doc.text('CERTIFICADO DE SEGURO');
      doc.image('assets/esicubaLogo.jpg', 460, 75, { scale: 0.2 });
      doc
        .fillColor('gray')
        .fontSize(12)
        .font(font)
        .text('Válido en el territorio nacional de la República de Cuba', {});
      doc.moveDown();
      doc.moveDown();

      doc
        .fillColor(pantoneColor)
        .fontSize(13)
        .font(fontBold)
        .lineGap(2)
        .text('ASEGURADOR: ', {
          continued: true,
        });
      doc
        .fillColor(blackColor)

        .font(font)
        .text('Seguros Internacionales de Cuba, S.A. (ESICUBA)');
      doc
        .fillColor(pantoneColor)

        .font(fontBold)
        .text('No Póliza: ', {
          continued: true,
        });
      doc.fillColor(blackColor).font(font).text(traveler.contractor.poliza);
      doc.fillColor(pantoneColor).font(fontBold).text('Cliente: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(traveler.contractor.client);
      doc.fillColor(pantoneColor).font(fontBold).text('Contratante: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(traveler.name);
      doc.fillColor(pantoneColor).font(fontBold).text('Pasaporte: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(traveler.passport);
      doc.fillColor(pantoneColor).font(fontBold).text('Vigencia del Seguro ');
      doc.text('     Desde : ', {
        continued: true,
      });
      doc
        .fillColor(blackColor)
        .font(font)
        .text(
          new Date(traveler.start_date).toLocaleDateString('ES', timeFormat),
          {
            continued: true,
          },
        );
      doc.fillColor(pantoneColor).font(fontBold).text('    Hasta: ', {
        continued: true,
      });
      doc
        .fillColor(blackColor)
        .font(font)
        .text(
          new Date(traveler.end_date_policy).toLocaleDateString(
            'ES',
            timeFormat,
          ),
        );
      doc.fillColor(pantoneColor).font(fontBold).text('Precio del seguro: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(templatePrice);
      doc.fillColor(pantoneColor).font(fontBold).text('Extraprima: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(highRisk);
      doc.fillColor(pantoneColor).font(fontBold).text('Total a Pagar: ', {
        continued: true,
      });
      doc
        .fillColor(blackColor)
        .font(font)
        .text('USD ' + total);
      doc.fillColor(pantoneColor).font(fontBold).text('Plan de Viaje: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(traveler.coverage.name);
      //doc.text()
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });
    //const doc = new PDFMerger();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    if (traveler.coverage.benefitTable) {
      const coveragePath = join(
        FileHelper.uploadsPath,
        'coverages',
        traveler.coverage.benefitTable,
      );
      const pdfB = await PDFDocument.load(fs.readFileSync(coveragePath));
      //const table = await pdfB.copyPages(pdfB, [0]);
      //console.log(pdfB.getPages);
      const pagesCopy = pdfB.getPageIndices();
      const pages = await pdfDoc.copyPages(pdfB, pagesCopy);
      pages.map((page) => {
        pdfDoc.addPage(page);
      });
    }
    return pdfDoc.save();
  }

  //async downloadTest(traveler:TravelerEntity,res:any): Observable<Object> {}
}
