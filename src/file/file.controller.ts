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
  ParseBoolPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GetUser } from 'src/common/decorator/user.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/user.role';
import { FilterFileDto } from './dto/filter-file.dto';
import { FileService } from './file.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT, UserRole.CLIENT)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Roles(
    UserRole.ADMIN,
    UserRole.MARKAGENT,
    UserRole.COMAGENT,
    UserRole.CLIENT,
    UserRole.CONSULT,
  )
  @Get()
  async findAll(@GetUser() user: UserEntity) {
    return await this.fileService.findAll(user);
  }

  @Get('/filter')
  async filterFile(
    @Query() filter: FilterFileDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.fileService.filterFile(filter, user);
  }
  @Get('/excel')
  async getExcel(
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
  @Get('/pdf')
  async getPdf(
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
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fileService.findOne(+id);
  }
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fileService.remove(+id);
  }
}
