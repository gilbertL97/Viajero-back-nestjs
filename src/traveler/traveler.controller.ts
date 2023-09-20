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
  ParseIntPipe,
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
import { ResponseErrorOrWarningDto } from './dto/responseErrorOrWarning.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TravelerAndTotal } from './dto/TravelerPag.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FileErrorsTravelerDto } from './dto/fileErrorsTravelers.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Viajeros')
@Controller('traveler')
export class TravelerController {
  constructor(
    private readonly travelerService: TravelerService,
    private readonly travelerDocService: TravelerPdfService,
    private readonly travelerUploadService: TravelerUploadFilesService,
  ) {}
  @ApiCreatedResponse({
    description: 'Devuelve el viajero creado',
    type: CreateTravelerDto,
  })
  @UseGuards(RolesGuard)
  //@UseGuards(ValidateCoverage)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Post()
  async createTraveler(
    //@GetUser() user: UserEntity,
    @Body() createTravelerDto: CreateTravelerDto,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.create(createTravelerDto);
    return data;
  }
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        travelers: {
          type: 'Archivo',
          format: '.xls , xlsx, cs',
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'Endpoint para realizar la importacion de un fichero (css, xlsx) con datos. ',
    description: '![alt text](assets/excel.jpg)',
  })
  @ApiOkResponse({
    description: 'No devuelve datos ya que la importacion fue exitosa',
  })
  @ApiAcceptedResponse({
    description:
      'De vuelve un objeto con las advertencias a pesar que se realizo la importacion del fichero',
    type: FileErrorsTravelerDto,
  })
  @ApiConflictResponse({
    description:
      'De vuelve un objeto con las advertencias y errores sobre la no importacion',
    type: FileErrorsTravelerDto,
  })
  @Throttle(1, 15) //agregando mas tiempo a esta peticion ya q lleva mayor tiempo de respuesta
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Post('/file/:id')
  @UseInterceptors(FileInterceptor('travelers', TravelersStorage))
  async uploadTravelers(
    @GetUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response,
  ): Promise<Response<ResponseErrorOrWarningDto | void>> {
    const resp = await this.travelerUploadService.processFile(file, id, user);
    if (!resp) {
      return response.status(HttpStatus.OK).send();
    }
    if (resp.containErrors)
      return response.status(HttpStatus.CONFLICT).send(resp.errorAndWarning);
    return response.status(HttpStatus.ACCEPTED).send(resp.errorAndWarning);
  }

  @ApiExcludeEndpoint()
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
  @Get('/pagination')
  async getTravelersPagination(
    @GetUser() user: UserEntity,
    @Query() pag: PaginationDto,
  ): Promise<TravelerAndTotal> {
    const data = await this.travelerService.findAllPagination(user, pag);
    return data;
  }

  @ApiExcludeEndpoint()
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
    const data = await this.travelerService.advancedSearch(
      travelerFilter,
      user,
    );
    return data;
  }
  @Post('/filter/pag')
  async advanceSearchTravelerPag(
    @GetUser() user: UserEntity,
    @Body() travelerFilter: FilterTravelerDto,
    @Query() pag: PaginationDto,
  ): Promise<TravelerAndTotal> {
    const data = await this.travelerService.advancedSearchPag(
      travelerFilter,
      user,
      pag,
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
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.findOne(id);
    return data;
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Patch(':id')
  async updateTraveler(
    //@GetUser() user: UserEntity,
    @Param('id', new ParseIntPipe()) id: string,
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
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<TravelerEntity> {
    const data = await this.travelerService.remove(id);
    return data;
  }
}
