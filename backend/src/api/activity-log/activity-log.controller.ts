import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { ActivityLogDto } from './dto/responses/activity-log.dto';
import { FindActivityLogsQueryDto } from './dto/responses/activity-log-query.dto';

@Controller('activity-logs')
@ApiBearerAuth('supabase-auth')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiCommonResponse(ActivityLogDto, true, 'Get activity logs')
  findAll(
    @Query() query: FindActivityLogsQueryDto,
  ): Promise<CommonResponseDto<ActivityLogDto[]>> {
    return this.activityLogService.findAll(query);
  }
}
