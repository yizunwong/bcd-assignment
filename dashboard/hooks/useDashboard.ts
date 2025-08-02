import { useDashboardControllerGetSummary } from '@/api';
import { parseError } from '@/utils/parseError';


export function useAdminDashboardSummaryQuery() {
  const query = useDashboardControllerGetSummary();
  return {
    ...query,
    error: parseError(query.error),
  };
}

