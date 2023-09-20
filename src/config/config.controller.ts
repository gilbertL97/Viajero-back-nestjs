import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomConfigService } from './service/config.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: CustomConfigService) {}

  @Get()
  findAll() {
    return this.configService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.configService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateConfigDto: UpdateConfigDto,
  ) {
    return this.configService.update(+id, updateConfigDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.configService.remove(+id);
  }
}
