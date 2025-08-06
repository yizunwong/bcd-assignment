import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { AdminDashoboardDto } from './dto/admin-dashboard.dto';
import { PolicyholderDashboardDto } from './dto/policyholder-dashboard.dto';

@Controller('dashboard')
@ApiBearerAuth('supabase-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(AdminDashoboardDto, false, 'Get admin dashboard summary')
  getSummary(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<AdminDashoboardDto>> {
    return this.dashboardService.getAdminSummary(req);
  }

  @Get('policyholder')
  @UseGuards(AuthGuard)
  @ApiCommonResponse(
    PolicyholderDashboardDto,
    false,
    'Get policyholder dashboard summary',
  )
  async getPolicyholderSummary(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<PolicyholderDashboardDto>> {
    return this.dashboardService.getPolicyholderSummary(req);
  }
}
