import { useDashboardControllerGetSummary, type CommonResponseDto } from '@/api';
import { customFetcher } from '@/api/fetch';
import { useQuery } from '@tanstack/react-query';
import { parseError } from '@/utils/parseError';

interface PolicyholderDashboardData {
  activeCoverage: number;
  totalCoverage: number;
  pendingClaims: number;
}

export function useAdminDashboardSummaryQuery() {
  const query = useDashboardControllerGetSummary();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function usePolicyholderDashboardSummaryQuery() {
  const query = useQuery<
    CommonResponseDto & { data: PolicyholderDashboardData }
  >({
    queryKey: ['policyholder-dashboard'],
    queryFn: ({ signal }) =>
      customFetcher({
        url: '/coverage/policyholder/dashboard',
        method: 'GET',
        signal,
      }),
  });

  return {
    ...query,
    error: parseError(query.error),
  };
}

