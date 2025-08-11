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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
import { FindCoverageQueryDto } from './dto/responses/coverage-query.dto';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { CoverageResponseDto } from './dto/responses/coverage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocDto } from '../file/requests/document-upload.dto';

@Controller('coverage')
@ApiBearerAuth('supabase-auth')
export class CoverageController {
  constructor(private readonly coverageService: CoverageService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(CoverageResponseDto, false, 'Create coverage')
  async create(
    @Body() createCoverageDto: CreateCoverageDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<CoverageResponseDto>> {
    return await this.coverageService.create(createCoverageDto, req);
  }

  @Post('agreement')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  async uploadAgreement(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<string>> {
    return this.coverageService.uploadAgreement(file, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(CoverageResponseDto, true, 'Get all coverages')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindCoverageQueryDto,
  ): Promise<CommonResponseDto<CoverageResponseDto[]>> {
    return this.coverageService.findAll(req, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(CoverageResponseDto, false, 'Get coverage')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<CoverageResponseDto>> {
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

  @Get('policyholder/summary')
  @UseGuards(AuthGuard)
  async getCoverageStats(@Req() req: AuthenticatedRequest) {
    return this.coverageService.getCoverageStats(req);
  }
}
