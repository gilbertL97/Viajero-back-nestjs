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
  findAll(@GetUser() user: UserEntity) {
    return this.fileService.findAll(user);
  }

  @Get('/filter')
  filterFile(@Query() filter: FilterFileDto, @GetUser() user: UserEntity) {
    console.log(filter);
    return this.fileService.filterFile(filter, user);
  }
  @Get('/filter')
  getExcel(
    @Query() filter: FilterFileDto,
    @GetUser() user: UserEntity,
    @Res() res,
  ) {
    console.log(filter);
    const files = this.fileService.filterFile(filter, user);
    const buffer = this.fileService.exportExcel(files);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Dispotition': 'attachment;filename= Archivos.xlsx',
      'Content-Lenght': buffer.length,
    });
    res.end(buffer);
    //return res.send(buffer);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }
  @Roles(UserRole.ADMIN, UserRole.MARKAGENT, UserRole.COMAGENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
