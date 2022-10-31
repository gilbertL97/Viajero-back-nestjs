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
    
    /*const text='EXCLUSIONES
    Las prestaciones que no hayan sido solicitadas al Asegurador a través de la
    Central de Alarma de ASISTUR y efectuadas sin su acuerdo, salvo en caso
    de fuerza mayor o de imposibilidad material demostrada.
    La realización de la prueba diagnóstico para COVID-19 (PCR) o controles
    preventivos sanitarios al Viajero, establecidos en el protocolo médico por las
    autoridades sanitarias.
    Participación en competencias peligrosas de cualquier índole, así como los
    entrenamientos o pruebas, las apuestas y las consecuencias que
    sobrevengan de la práctica de pasatiempos peligrosos o de alto riesgo,
    incluyendo, pero no limitado a: caza, actividades subacuáticas, aladeltismo,
    parasail, alpinismo, motociclismo, automovilismo, boxeo, vehículos todo
    terreno, etc. Esta exclusión podrá quedar sin efecto mediante el pago de una
    extraprima.
    Enfermedades crónicas y/o preexistentes excepto cuando se trate de
    atención médica por urgencia médica. Quedan expresamente excluidos los
    estudios y/o los tratamientos relacionados con enfermedades crónicas o
    preexistentes o congénitas o recurrentes, conocidas o no por el Viajero
    padecidas con anterioridad al inicio de la vigencia de este seguro y/o del viaje,
    lo que sea posterior, así como sus agudizaciones, secuelas o consecuencias
    (incluso cuando las mismas aparezcan durante el viaje).
    Las consecuencias de las intervenciones quirúrgicas no motivadas por un
    accidente.
    Estas COBERTURAS y EXCLUSIONES son a título informativo. Usted debe
    leer las CONDICIONES GENERALES para informarse detalladamente de las
    características del Seguro de Viaje.
    Cancelación del Seguro: Después de transcurridas 72h antes de la fecha de
    inicio del seguro, el Viajero NO podrá hacer efectiva la cancelación.'*/
    const pantoneColor='#1b1462';
    const  blackColor='black';
    const font='Helvetica';
    const fontBold='Helvetica-Bold';
    const timeFormat: Intl.DateTimeFormatOptions = {  year: 'numeric', month: 'long', day: 'numeric' }
    const templatePrice = traveler.coverage.daily ? traveler.coverage.price+' $USD pax/dia':traveler.coverage.price+' $USD x dias'

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });
      doc
        .fillColor(pantoneColor)
        .font(fontBold)
        .fontSize(15)
        .text('SEGURO DE ASISTENCIA AL VIAJERO (VIAJES IN)');
      doc.text('CERTIFICADO DE SEGURO');
      doc.image('assets/esicubaLogo.jpg', 460, 75, { scale: 0.20 });
      doc
        .fillColor('gray')
        .fontSize(12)
        .font(font)
        .text('Válido en el territorio nacional de la República de Cuba', {});
        doc.moveDown();
        doc.moveDown();

      doc
        .fillColor(pantoneColor)
        .fontSize(12)
        .font(fontBold)
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
        .text('No Poliza: ', {
          continued: true,
        });
      doc
        .fillColor(blackColor)
        .font(font)
        .text(traveler.contractor.poliza);
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
      doc
        .fillColor(pantoneColor)
        .font(fontBold)
        .text('Vigencia del Seguro ');
      doc.text('Desde : ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font)
      .text(new Date(traveler.start_date).toLocaleDateString('ES',timeFormat), {
        continued: true,
      });
      doc
      .fillColor(pantoneColor)
      .font(fontBold)
      .text('    Hasta: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font)
      .text(new Date(traveler.end_date_policy).toLocaleDateString('ES',timeFormat));
      doc
      .fillColor(pantoneColor)
      .font(fontBold)
      .text('Precio del seguro: ', {
        continued: true,
      });
      doc.fillColor(blackColor).font(font).text(templatePrice);
      doc
      .fillColor(pantoneColor)
      .font(fontBold)
      .text('Plan de Viaje: ', {
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
    return pdfBuffer;
  }
  //async downloadTest(traveler:TravelerEntity,res:any): Observable<Object> {}
}
