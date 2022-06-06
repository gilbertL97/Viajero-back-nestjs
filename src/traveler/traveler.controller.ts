import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TravelerService } from './traveler.service';
import { CreateTravelerDto } from './dto/create-traveler.dto';
import { UpdateTravelerDto } from './dto/update-traveler.dto';

@Controller('traveler')
export class TravelerController {
  constructor(private readonly travelerService: TravelerService) {}

  @Post()
  createTraveler(@Body() createTravelerDto: CreateTravelerDto) {
    return this.travelerService.create(createTravelerDto);
  }

  @Get()
  getTravelers() {
    return this.travelerService.findAll();
  }

  @Get(':id')
  getTraveler(@Param('id') id: string) {
    return this.travelerService.findOne(+id);
  }

  @Patch(':id')
  updateTraveler(
    @Param('id') id: string,
    @Body() updateTravelerDto: UpdateTravelerDto,
  ) {
    return this.travelerService.update(+id, updateTravelerDto);
  }

  @Delete(':id')
  deleteTraveler(@Param('id') id: string) {
    return this.travelerService.remove(+id);
  }
}
