import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CoverageService } from './coverage.service';
import {
  CoverageStatus,
  CreateCoverageDto,
} from './dto/requests/create-coverage.dto';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
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
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest, // Authenticated request to access Supabase
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('status') status?: CoverageStatus,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.coverageService.findAll(
      req,
      +page,
      +limit,
      category,
      search,
      status,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.coverageService.findOne(+id, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCoverageDto: UpdateCoverageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coverageService.update(+id, updateCoverageDto, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.coverageService.remove(+id, req);
  }
}
