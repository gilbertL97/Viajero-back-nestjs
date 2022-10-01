import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/user/user.role';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MARKAGENT)
@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post()
  async create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coverageService.createCoverage(createCoverageDto);
  }
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.MARKAGENT,
    UserRole.CONSULT,
  )
  @Get()
  async findAll() {
    return this.coverageService.getCoverages();
  }
  @Get('/active')
  async findAllActive() {
    return this.coverageService.getCoveragesActives();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.coverageService.getCoverage(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCoverageDto: UpdateCoverageDto,
  ) {
    return this.coverageService.updateCoverage(id, updateCoverageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.coverageService.deleteCoverage(id);
  }
}
