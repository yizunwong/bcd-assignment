import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CommonResponseDto } from 'src/common/common.dto';
import { AdminDashoboardDto, TopPolicyDto } from './dto/admin-dashboard.dto';
import {
  ActiveCoverageDto,
  PolicyholderDashboardDto,
} from './dto/policyholder-dashboard.dto';

@Injectable()
export class DashboardService {
  async getAdminSummary(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<AdminDashoboardDto>> {
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

    const { data: salesData, error: salesError } =
      await supabase.rpc('count_policy_sales');
    if (salesError) {
      throw new InternalServerErrorException('Failed to fetch policy sales');
    }

    const { data: activeUsersData, error: activeUsersError } =
      await supabase.rpc('count_active_users_by_company');
    if (activeUsersError) {
      throw new InternalServerErrorException('Failed to count active users');
    }
    const activeUsers = (activeUsersData || []).reduce(
      (sum: number, row: { active_users: number }) => sum + row.active_users,
      0,
    );

    const { data: revenueData, error: revenueError } = await supabase.rpc(
      'calculate_policy_revenue',
    );
    if (revenueError) {
      throw new InternalServerErrorException('Failed to calculate revenue');
    }
    const totalRevenue = (revenueData || []).reduce(
      (sum: number, row: { total_revenue: number }) => sum + row.total_revenue,
      0,
    );

    const sorted = (salesData || [])
      .sort((a: { sales: number }, b: { sales: number }) => b.sales - a.sales)
      .slice(0, 5);
    const ids = sorted.map((s) => s.policy_id);

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
        (s: { policy_id: number; sales: number }): TopPolicyDto =>
          new TopPolicyDto({
            id: s.policy_id,
            name: policies.find((p) => p.id === s.policy_id)?.name || '',
            sales: s.sales,
          }),
      );
    }

    return new CommonResponseDto<AdminDashoboardDto>({
      statusCode: 200,
      message: 'Dashboard summary retrieved successfully',
      data: new AdminDashoboardDto({
        activePolicies: activeCount || 0,
        pendingClaims: pendingCount || 0,
        activeUsers,
        totalRevenue,
        topPolicies,
      }),
    });
  }

  async getPolicyholderSummary(req: AuthenticatedRequest) {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userId = userData.user.id;

    const { data: activeCoverages, error: coverageError } = await req.supabase
      .from('coverage')
      .select(
        `
      id,
      policy_id,
      status,
      utilization_rate,
      start_date,
      end_date,
      next_payment_date,
      policy:policy_id (
        name,
        coverage
      )
    `,
      )
      .eq('user_id', userId)
      .eq('status', 'active'); // ✅ Filter active at DB level

    if (coverageError) {
      throw new InternalServerErrorException(
        'Failed to fetch active coverages',
      );
    }

    const activeCoverage = activeCoverages.length;
    const totalCoverage = activeCoverages.reduce(
      (sum, c) => sum + (c.policy?.coverage || 0),
      0,
    );

    const { data: pendingClaims, error: pendingClaimsError } =
      await req.supabase
        .from('claims')
        .select('id')
        .eq('submitted_by', userId)
        .eq('status', 'pending');

    if (pendingClaimsError) {
      throw new InternalServerErrorException('Failed to fetch pending claims');
    }

    return new CommonResponseDto<PolicyholderDashboardDto>({
      statusCode: 200,
      message: 'Policyholder dashboard summary retrieved successfully',
      data: new PolicyholderDashboardDto({
        activeCoverage,
        totalCoverage,
        pendingClaims: pendingClaims.length,
        activeCoverageObject: activeCoverages.map(
          (c) => new ActiveCoverageDto(c),
        ),
      }),
    });
  }
}
