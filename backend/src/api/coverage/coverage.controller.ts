import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
// import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/supabase/types/express';

@Controller('coverage')
@ApiBearerAuth('supabase-auth')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCoverageDto: CreateCoverageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.coverageService.create(createCoverageDto, req);
  }

  @Get()
  findAll() {
    return this.coverageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coverageService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCoverageDto: UpdateCoverageDto,
  // ) {
  //   return this.coverageService.update(+id, updateCoverageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coverageService.remove(+id);
  }
}
