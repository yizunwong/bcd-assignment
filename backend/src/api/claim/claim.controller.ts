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
  UploadedFiles,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimStatus, UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FindClaimsQueryDto } from './dto/responses/claims-query.dto';
import { ClaimResponseDto } from './dto/responses/claim.dto';
import { ClaimStatsDto } from './dto/responses/claim-stats.dto';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { UploadDocDto } from '../file/requests/document-upload.dto';

@Controller('claim')
@ApiBearerAuth('supabase-auth')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createClaimDto: CreateClaimDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.claimService.createClaim(createClaimDto, req);
  }

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: UploadDocDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.claimService.addClaimDocuments(+id, files, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, true, 'Get all claims with signed URLs')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindClaimsQueryDto,
  ): Promise<CommonResponseDto<ClaimResponseDto[]>> {
    return this.claimService.findAll(req, query);
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(
    ClaimStatsDto,
    false,
    'Get claim statistics',
  )
  getStats(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<ClaimStatsDto>> {
    return this.claimService.getStats(req);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, false, 'Get claim with signed URLs')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<CommonResponseDto<ClaimResponseDto>> {
    return this.claimService.findOne(req, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, false, 'Update claim')
  update(
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.claimService.update(+id, updateClaimDto, req);
  }

  @Patch(':id/:status')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, false, 'Update claim')
  @ApiParam({
    name: 'status',
    enum: ClaimStatus,
    enumName: 'ClaimStatus',
    description: 'New status to set for the claim',
  })
  updateClaimStatus(
    @Param('id') id: string,
    @Param('status') status: ClaimStatus,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.claimService.updateClaimStatus(+id, status, req);
  }

  @Delete(':id/file')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, false, 'Remove claim document')
  removeFile(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.claimService.removeClaimDocument(req, +id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ClaimResponseDto, false, 'Remove claim')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid claim id');
    }
    return this.claimService.remove(numId, req);
  }
}
