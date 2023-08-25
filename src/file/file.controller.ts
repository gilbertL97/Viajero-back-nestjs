import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { FilterFileDto } from './dto/filter-file.dto';
import { AutoImportFileService } from './service/automaticImportFile';
import { FileService } from './service/file.service';

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly autoImportService: AutoImportFileService,
  ) {}
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
  async findAllFile(@GetUser() user: UserEntity) {
    return await this.fileService.findAll(user);
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
  async filterFile(
    @Query() filter: FilterFileDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.fileService.filterFile(filter, user);
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
  async getExcelFile(
    @Query() filter: FilterFileDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ) {
    const files = await this.fileService.filterFile(filter, user);
    const buffer = await this.fileService.exporToExcel(files);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.byteLength,
    });
    res.end(buffer);
    //return res.send(buffer);
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
  async getPdfFile(
    @Query() filter: FilterFileDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ) {
    const files = await this.fileService.filterFile(filter, user);
    const buffer = await this.fileService.exporToPdf(files);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Dispotition': 'attachment;Archivos.pdf',
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
  async findOneFile(@Param('id') id: string, @GetUser() user: UserEntity) {
    return await this.fileService.findOneFile(+id, user);
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
  @Get('/name/:name')
  async findOneFileByName(@Param('name') name: string) {
    return await this.fileService.findByName(name);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
  @Delete(':id')
  async removeFile(@Param('id') id: string) {
    return await this.fileService.remove(+id);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT)
  @Post('/task')
  async executeAutoImport(@Res() res, @GetUser() user: UserEntity) {
    console.log(user);
    const buffer = await this.autoImportService.manuallyImportFiles(user);
    if (buffer.length > 0) {
      res.set({
        'Content-Type': 'application/zip',
        'Content-Dispotition': 'attachment;filename=Logs.zip',
        'Content-Lenght': buffer.byteLength,
      });
      res.end(buffer);
    } else return res.status(HttpStatus.OK).send();
  }
}
