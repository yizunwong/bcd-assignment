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
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FindClaimsQueryDto } from './dto/responses/find-claims-query.dto';
import { ClaimResponseDto } from './dto/responses/claim.dto';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';

@Controller('claim')
@ApiBearerAuth('supabase-auth')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents'))
  @UseGuards(AuthGuard)
  create(
    @Body() createClaimDto: CreateClaimDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.claimService.createClaim(createClaimDto, req, files);
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

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.claimService.findOne(req, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.claimService.update(+id, updateClaimDto, req);
  }
  @Delete(':id/file')
  @UseGuards(AuthGuard)
  async removeFile(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.claimService.removeClaimDocument(+id);
    return { message: `File ${id} deleted (if existed)` };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new BadRequestException('Invalid claim id');
    }
    return this.claimService.remove(numId, req);
  }
}
