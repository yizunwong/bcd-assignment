import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CommonResponseDto } from 'src/common/common.dto';
import { DashboardSummaryDto, TopPolicyDto } from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  async getAdminSummary(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<DashboardSummaryDto>> {
    const supabase = req.supabase;

    const { count: activeCount, error: activeError } = await supabase
      .from('policies')
      .select('id', { head: true, count: 'exact' })
      .eq('status', 'active');
    if (activeError) {
      throw new InternalServerErrorException('Failed to count active policies');
    }

    const { count: pendingCount, error: pendingError } = await supabase
      .from('claims')
      .select('id', { head: true, count: 'exact' })
      .eq('status', 'pending');
    if (pendingError) {
      throw new InternalServerErrorException('Failed to count pending claims');
    }

    const { data: salesData, error: salesError } = await supabase.rpc(
      'count_policy_sales',
    );
    if (salesError) {
      throw new InternalServerErrorException('Failed to fetch policy sales');
    }

    const sorted = (salesData || [])
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 5);
    const ids = sorted.map((s: any) => s.policy_id);

    let topPolicies: TopPolicyDto[] = [];
    if (ids.length) {
      const { data: policies, error: policiesError } = await supabase
        .from('policies')
        .select('id, name')
        .in('id', ids);
      if (policiesError) {
        throw new InternalServerErrorException('Failed to fetch policies');
      }
      topPolicies = sorted.map(
        (s: any): TopPolicyDto => (
          new TopPolicyDto({
            id: s.policy_id,
            name: policies.find((p) => p.id === s.policy_id)?.name || '',
            sales: s.sales,
          })
        ),
      );
    }

    return new CommonResponseDto<DashboardSummaryDto>({
      statusCode: 200,
      message: 'Dashboard summary retrieved successfully',
      data: new DashboardSummaryDto({
        activePolicies: activeCount || 0,
        pendingClaims: pendingCount || 0,
        topPolicies,
      }),
    });
  }
}
