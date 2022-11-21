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
    @UploadedFile() files: Express.Multer.File,
    @Body() createCoverageDto: CreateCoverageDto,
  ) {
    return this.coverageService.createCoverage(createCoverageDto, files);
  }
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
    return this.coverageService.getCoverages();
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get('/active')
  async findAllActive() {
    return this.coverageService.getCoveragesActives();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.coverageService.getCoverage(id);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoverageDto: UpdateCoverageDto,
  ) {
    return this.coverageService.updateCoverage(id, updateCoverageDto);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.coverageService.deleteCoverage(id);
  }
}
