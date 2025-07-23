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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { PolicyResponseDto } from './dto/responses/policy.dto';
import { FindPoliciesQueryDto } from './dto/responses/policy-query.dto';

@Controller('policy')
@ApiBearerAuth('supabase-auth')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreatePolicyDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CommonResponseDto> {
    if (typeof dto.features === 'string') {
      dto.features = (dto.features as string).split(',').map((v) => v.trim());
    }

    return this.policyService.create(dto, req, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(PolicyResponseDto, true, 'Get all policies')
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindPoliciesQueryDto,
  ): Promise<CommonResponseDto<PolicyResponseDto[]>> {
    return this.policyService.findAll(req, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(PolicyResponseDto, false, 'Get policy with signed URLs')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<PolicyResponseDto>> {
    return this.policyService.findOne(+id, req);
  }

  @Get('dashboard/policyholder/:userId/summary')
  @UseGuards(AuthGuard)
  getSummary(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.policyService.getPolicyholderSummary(userId, req);
  }

  // GET /browse/categories?userId=xxx
  @Get('/browse/categories')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('supabase-auth')
  async getCategoryCounts(
    @Query('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.policyService.getPolicyCountByCategory(userId, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(PolicyResponseDto, false, 'Update policy')
  update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.policyService.update(+id, updatePolicyDto, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(PolicyResponseDto, false, 'Remove policy')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.policyService.remove(+id, req);
  }
}
