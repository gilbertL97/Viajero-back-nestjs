import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractorService } from 'src/contractor/contractor.service';
import { CountryService } from 'src/country/country.service';
import { CoverageService } from 'src/coverage/coverage.service';
import { UserService } from 'src/user/user.service';
import { TravelerRepository } from '../traveler.repository';
import doc, * as PDFDocument from 'pdfkit';
import { Observable } from 'rxjs';
import { TravelerEntity } from '../entity/traveler.entity';

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
      doc.text(traveler.name);
      doc.moveDown();
      doc.text(traveler.coverage.name);
      doc.moveDown();
      doc.text(traveler.contractor.client);
      doc.moveDown();
      doc.text('heeeeee sirvio');
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
