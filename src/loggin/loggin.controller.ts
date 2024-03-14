import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogginService } from './loggin.service';
import { CreateLogginDto } from './dto/create-loggin.dto';
import { UpdateLogginDto } from './dto/update-loggin.dto';

@Controller('loggin')
export class LogginController {
  constructor(private readonly logginService: LogginService) {}

  @Post()
  create(@Body() createLogginDto: CreateLogginDto) {
    return this.logginService.create(createLogginDto);
  }

  @Get()
  findAll() {
    return this.logginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logginService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogginDto: UpdateLogginDto) {
    return this.logginService.update(+id, updateLogginDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logginService.remove(+id);
  }
}
