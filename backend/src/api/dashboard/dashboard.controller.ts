import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Controller('dashboard')
@ApiBearerAuth('supabase-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(DashboardSummaryDto, false, 'Get dashboard summary')
  getSummary(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<DashboardSummaryDto>> {
    return this.dashboardService.getAdminSummary(req);
  }

  @Get('policyholder')
  @UseGuards(AuthGuard)
  async getPolicyholderSummary(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getPolicyholderSummary(req);
  }
}
