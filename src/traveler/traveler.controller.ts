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
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
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
import { TravelersStorage } from 'src/common/file/storage';
import { TravelerUploadFilesService } from './service/traveler.upload-files.service';
import { FileTravelerDto } from './dto/file-traveler.dto';
import { FileErrorsTravelerDto } from './dto/fileErrorsTravelers.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('traveler')
export class TravelerController {
  constructor(
    private readonly travelerService: TravelerService,
    private readonly travelerDocService: TravelerPdfService,
    private readonly travelerUploadService: TravelerUploadFilesService,
  ) {}
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Post()
  async createTraveler(
    //@GetUser() user: UserEntity,
    @Body() createTravelerDto: CreateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.create(createTravelerDto);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Post('/file/:id')
  @UseInterceptors(FileInterceptor('travelers', TravelersStorage))
  async uploadTravelers(
    //@GetUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response<FileTravelerDto[] | FileErrorsTravelerDto[] | void>> {
    const resp = await this.travelerUploadService.processFile(file, id);
    if (!resp) {
      return response.status(HttpStatus.ACCEPTED).send();
    }

    if (resp[0] instanceof FileErrorsTravelerDto)
      return response.status(HttpStatus.BAD_REQUEST).send(resp);
    return response.status(HttpStatus.CONFLICT).send(resp);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get()
  async getTravelers(@GetUser() user: UserEntity): Promise<TravelerEntity[]> {
    const data = await this.travelerService.findAll(user);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/filter')
  async advanceSearchTraveler(
    @GetUser() user: UserEntity,
    @Query() travelerFilter: FilterTravelerDto,
  ): Promise<TravelerEntity[]> {
    console.log(travelerFilter);
    const data = await this.travelerService.advancedSearch(
      travelerFilter,
      user,
    );
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/excel')
  async exportTravelerToExcel(
    @GetUser() user: UserEntity,
    @Query() travelerFilter: FilterTravelerDto,
    @Res() res,
  ) {
    const buffer = await this.travelerService.getTravelerExcel(
      travelerFilter,
      user,
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/pdf')
  async exportTravelerToPdf(
    @GetUser() user: UserEntity,
    @Query() travelerFilter: FilterTravelerDto,
    @Res() res,
  ): Promise<void> {
    const buffer = await this.travelerService.getTravelerPdf(
      travelerFilter,
      user,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Viajero.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/current')
  async currentTravelers(@Query() travelerFilter: FilterTravelerDto) {
    const data = await this.travelerService.getCurrrentTravelers(
      travelerFilter,
    );
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/file/:id')
  async getTravelersBfile(@Param() id: number) {
    const data = await this.travelerService.findByFile(id);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get('/cert')
  async generateCertPdf(@Query('id') id: string, @Res() res): Promise<void> {
    const traveler = await this.travelerService.findOne(id);
    const buffer = await this.travelerDocService.generateCerticate(traveler);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;' + traveler.name + '.pdf',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
  }
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
    UserRole.CONSULTAGENT,
  )
  @Get(':id')
  async getTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.findOne(id);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Patch(':id')
  async updateTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
    @Body() updateTravelerDto: UpdateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.update(id, updateTravelerDto);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Delete(':id')
  async deleteTraveler(
    //@GetUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.remove(id);
    return data;
  }
}
