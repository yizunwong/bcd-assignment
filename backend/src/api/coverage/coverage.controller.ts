import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@Controller('coverage')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post()
  create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coverageService.create(createCoverageDto);
  }

  @Get()
  findAll() {
    return this.coverageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coverageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoverageDto: UpdateCoverageDto,
  ) {
    return this.coverageService.update(+id, updateCoverageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coverageService.remove(+id);
  }
}
