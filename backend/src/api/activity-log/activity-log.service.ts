import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FindActivityLogsQueryDto } from './dto/responses/activity-log-query.dto';
import { ActivityLogDto } from './dto/responses/activity-log.dto';
import { CommonResponseDto } from 'src/common/common.dto';

@Injectable()
export class ActivityLogService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(
    query: FindActivityLogsQueryDto,
  ): Promise<CommonResponseDto<ActivityLogDto[]>> {
    const supabase = this.supabaseService.createClientWithToken();
    const offset = (query.page - 1) * query.limit;

    let dbQuery = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .range(offset, offset + query.limit - 1)
      .order('timestamp', { ascending: false });

    if (query.userId) {
      dbQuery = dbQuery.eq('user_id', query.userId);
    }
    if (query.action) {
      dbQuery = dbQuery.eq('action', query.action);
    }

    const { data, error, count } = await dbQuery;

    if (error) {
      throw new InternalServerErrorException('Failed to fetch activity logs');
    }

    return new CommonResponseDto<ActivityLogDto[]>({
      statusCode: 200,
      message: 'Activity logs retrieved successfully',
      data: (data || []).map((log) => new ActivityLogDto(log)),
      count: count || 0,
    });
  }
}
