import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorService } from 'src/contractor/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CoverageService } from 'src/coverage/coverage.service';
import { UserService } from 'src/user/user.service';
import { TravelerRepository } from '../traveler.repository';
import doc, * as PDFDocument from 'pdfkit';

import { TravelerEntity } from '../entity/traveler.entity';
import { join } from 'path';

@Injectable()
export class TravelerDocService {
  constructor(
    @InjectRepository(TravelerRepository)
    private readonly travelerRepository: TravelerRepository,
    private readonly contratctoService: ContractorService,
    private readonly countryService: CountryService,
    private readonly coverageService: CoverageService,
    private readonly userService: UserService,
  ) {}

  async createTestPDf(traveler: TravelerEntity): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });
      doc
        .fillColor('blue')
        .font('Helvetica-Bold')
        .lineGap(1)
        .fontSize(15)
        .text('SEGURO DE ASISTENCIA AL VIAJERO (VIAJES IN)');
      doc.text('CERTIFICADO DE SEGURO');
      doc.image('assets/esicubaLogo.jpg', 440, 60, { scale: 0.25 });
      doc
        .fillColor('gray')
        .fontSize(12)
        .font('Helvetica')
        .text('Válido en el territorio nacional de la República de Cuba', {});
      doc
        .fillColor('blue')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('ASEGURADOR :', {
          continued: true,
        });
      doc
        .fillColor('black')

        .font('Helvetica')
        .text(' Seguros Internacionales de Cuba, S.A. (ESICUBA)');
      doc
        .fillColor('blue')

        .font('Helvetica-Bold')
        .text('No Poliza : ', {
          continued: true,
        });
      doc
        .fillColor('black')
        .font('Helvetica')
        .text(traveler.contractor.poliza + '  ', {
          continued: true,
        });
      doc.fillColor('blue').font('Helvetica-Bold').text('Cliente : ', {
        continued: true,
      });
      doc.fillColor('black').font('Helvetica').text(traveler.contractor.client);
      doc.fillColor('blue').font('Helvetica-Bold').text('Contratante: ', {
        continued: true,
      });
      doc.fillColor('black').font('Helvetica').text(traveler.name, {
        continued: true,
      });
      doc.fillColor('blue').font('Helvetica-Bold').text(' Pasaporte: ', {
        continued: true,
      });
      doc.fillColor('black').font('Helvetica').text(traveler.passport);
      doc
        .fillColor('blue')
        .font('Helvetica-Bold')
        .text('Vigencia del Seguro :   ', {
          continued: true,
        });
      doc.text('Desde : ', {
        continued: true,
      });
      doc.fillColor('black').font('Helvetica');
      //  .text(traveler.start_date.toDateString.toString());
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();
    });
    return pdfBuffer;
  }
  //async downloadTest(traveler:TravelerEntity,res:any): Observable<Object> {}
}
