import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TravelerService } from './service/traveler.service';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { UpdateTravelerDto } from './dto/update-traveler.dto';
import { TravelerEntity } from './entity/traveler.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRole } from 'src/user/user.role';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { FilterTravelerDto } from './dto/filter-traveler.dto';
import { TravelerPdfService } from './service/traveler-pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { coverageStorage, TravelersStorage } from 'src/common/file/storage';
import { TravelerUploadFilesService } from './service/traveler.upload-files.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
@Controller('traveler')
export class TravelerController {
  constructor(
    private readonly travelerService: TravelerService,
    private readonly travelerDocService: TravelerPdfService,
    private readonly travelerUploadService: TravelerUploadFilesService,
  ) {}

  @Post()
  async createTraveler(
    //@GetUser() user: UserEntity,
    @Body() createTravelerDto: CreateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.create(createTravelerDto);
    return data;
  }
  @Post()
  @UseInterceptors(FileInterceptor('tablePdf', TravelersStorage))
  async uploadTravelers(
    //@GetUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<string> {
    await this.travelerUploadService.processFile(file, id);
    return 'ok';
  }

  @Get()
  async getTravelers(@GetUser() user: UserEntity): Promise<TravelerEntity[]> {
    const data = await this.travelerService.findAll(user);
    return data;
  }
  @Get('/filter')
  async advanceSearch(
    @Query() travelerFilter: FilterTravelerDto,
  ): Promise<TravelerEntity[]> {
    console.log(travelerFilter);
    const data = await this.travelerService.advancedSearch(travelerFilter);
    return data;
  }
  @Get('/cert')
  async generateCertPdf(@Query('id') id: string, @Res() res): Promise<void> {
    const traveler = await this.travelerService.findOne(id);
    const buffer = await this.travelerDocService.createTestPDf(traveler);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;' + traveler.name + '.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @Get(':id')
  async getTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.findOne(id);
    return data;
  }

  @Patch(':id')
  async updateTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
    @Body() updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.update(id, updateTravelerDto);
    return data;
  }

  @Delete(':id')
  async deleteTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.remove(id);
    return data;
  }
}
