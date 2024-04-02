import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FileHelper } from 'src/common/file/file.helper';
import { exportExcel } from 'src/common/export/exportExcel';
import { exportPdf } from 'src/common/export/exportPdf';

import { TravelerService } from 'src/traveler/service/traveler.service';
import { Repository } from 'typeorm';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { CoverageEntity } from './entities/coverage.entity';
import { Configuration } from 'src/config/config.const';

@Injectable()
export class CoverageService {
  constructor(
    @InjectRepository(CoverageEntity, Configuration.POSTGRESCONNECT)
    private readonly coverageRepository: Repository<CoverageEntity>,
    @Inject(forwardRef(() => TravelerService))
    private readonly travelerService: TravelerService,
  ) {}

  async createCoverage(
    createCoverageDto: CreateCoverageDto,
    file: Express.Multer.File,
  ): Promise<CoverageEntity> {
    const coverage = this.coverageRepository.create(createCoverageDto);
    if (file) coverage.benefitTable = file.filename;
    if (coverage.daily) coverage.number_of_days = null;
    else if (coverage.number_of_days == null) coverage.number_of_days = 30; // puse por defecto 30 dias
    const newCoverage = await this.coverageRepository
      .save(coverage)
      .catch(() => {
        if (coverage.benefitTable)
          FileHelper.deletFile(
            join(FileHelper.uploadsPath, coverage.benefitTable),
          );
        throw new BadRequestException('duplicate Name or File');
      });
    if (newCoverage.benefitTable)
      FileHelper.moveFile(
        join(FileHelper.uploadsPath, 'coverages', newCoverage.benefitTable),
        join(FileHelper.uploadsPath, newCoverage.benefitTable),
      );
    return newCoverage;
  }

  async getCoverages(): Promise<CoverageEntity[]> {
    return this.coverageRepository.find();
  }
  async getCoveragesActives(): Promise<CoverageEntity[]> {
    return this.coverageRepository.find({ where: { isActive: true } });
  }
  async getCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.coverageRepository.findOne({
      where: { id: id },
    });
    if (!coverage) throw new NotFoundException('does not exist coverage');
    return coverage;
  }

  async updateCoverage(
    id: number,
    updateCoverageDto: UpdateCoverageDto,
    file: Express.Multer.File,
  ): Promise<CoverageEntity> {
    const coverag = await this.getCoverage(id);
    const fileBefore = coverag.benefitTable;
    const updatedCoverage = Object.assign(coverag, updateCoverageDto);
    if (file) updatedCoverage.benefitTable = file.filename;
    if (updatedCoverage.daily) updatedCoverage.number_of_days = null;
    else if (updatedCoverage.number_of_days == null)
      updatedCoverage.number_of_days = 30; // puse por defecto 30 dias

    const coverageSaved = await this.coverageRepository
      .save(updatedCoverage)
      .catch(() => {
        if (file)
          FileHelper.deletFile(join(FileHelper.uploadsPath, file.filename));
        throw new BadRequestException('duplicate Name or File');
      });
    if (file) {
      if (fileBefore)
        FileHelper.deletFile(
          join(FileHelper.uploadsPath, 'coverages', fileBefore),
        );
      FileHelper.moveFile(
        join(FileHelper.uploadsPath, 'coverages', file.filename),
        join(FileHelper.uploadsPath, file.filename),
      );
    }
    return coverageSaved;
  }

  async deleteCoverage(id: number): Promise<CoverageEntity> {
    const coverage = await this.getCoverage(id);
    const traveler =
      await this.travelerService.findOneTravelerWithCoverage(coverage);
    if (!traveler) {
      const deletedCoverage = await this.coverageRepository.remove(coverage);
      if (deletedCoverage.benefitTable)
        FileHelper.deletFile(
          join(
            FileHelper.uploadsPath,
            'coverages',
            deletedCoverage.benefitTable,
          ),
        );
      return deletedCoverage;
    }
    coverage.isActive = false;
    await this.coverageRepository.save(coverage);
    throw new ConflictException('cant delete the Coverage');
  }

  exportExcel(coverage: CoverageEntity[]) {
    const columns = [
      { key: 'name', header: 'Nombre' },
      {
        key: 'price',
        header: 'Precio',
      },
      {
        key: 'daily',
        header: 'Diario',
      },
      {
        key: 'high_risk',
        header: 'Alto Riesgo',
      },
      {
        key: 'number_of_days',
        header: 'Cant de dias',
      },
      {
        key: 'isActive',
        header: 'Estado',
      },
      {
        key: 'config_string',
        header: 'Cadena de Configuracion',
      },
    ];
    return exportExcel(coverage, columns, 'Covertura');
  }
  exportToPdf(coverage: CoverageEntity[]) {
    const columns = [
      { label: 'Nombre', property: 'name', width: 100 },
      {
        label: 'Precio',
        property: 'price',
        width: 40,
      },
      {
        label: 'Diario',
        property: 'daily',
        width: 60,
        align: 'center',
      },
      {
        label: 'Alto Riesgo',
        property: 'high_risk',
        width: 50,
        align: 'center',
      },
      {
        label: 'Cant de dias',
        property: 'number_of_days',
        width: 60,
        align: 'center',
      },
      {
        label: 'Activo',
        property: 'isActive',
        width: 50,
        align: 'center',
      },
      {
        label: 'Cadena de Configuracion',
        property: 'config_string',
        width: 100,
      },
    ];
    return exportPdf(coverage, columns, 'Cobertura');
  }
}
