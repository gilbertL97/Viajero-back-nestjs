import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { coverageStorage } from 'src/common/file/storage';
import { UserRole } from 'src/user/user.role';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MARKAGENT)
@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Post()
  @UseInterceptors(FileInterceptor('tablePdf', coverageStorage))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCoverageDto: CreateCoverageDto,
  ) {
    //console.log(eq.rawHeaders, file);
    return this.coverageService.createCoverage(createCoverageDto, file);
  }
  /* @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Post('/config')
  async test(@Body() bod: { test: string; aprobar: string }) {
    return this.coverageService.test(bod.test, bod.aprobar);
  }*/
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.MARKAGENT,
    UserRole.CONSULT,
  )
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get()
  async findAll() {
    return await this.coverageService.getCoverages();
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/active')
  async findAllActive() {
    return await this.coverageService.getCoveragesActives();
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/excel')
  async excelCoverage(@Res() res) {
    const data = await this.coverageService.getCoverages();
    const buffer = await this.coverageService.exportExcel(data);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/pdf')
  async exporCoveragePdf(@Res() res): Promise<void> {
    const data = await this.coverageService.getCoverages();
    const buffer = await this.coverageService.exportToPdf(data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Coberturas.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.coverageService.getCoverage(id);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @UseInterceptors(FileInterceptor('tablePdf', coverageStorage))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoverageDto: UpdateCoverageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coverageService.updateCoverage(id, updateCoverageDto, file);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.coverageService.deleteCoverage(id);
  }
}
