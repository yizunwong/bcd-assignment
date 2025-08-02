import { useQuery } from "@tanstack/react-query";
import { customFetcher } from "@/api/fetch";

export interface DashboardSummary {
  activePolicies: number;
  pendingClaims: number;
  topPolicies: { id: number; name: string; sales: number }[];
}

export function useAdminDashboardSummary() {
  return useQuery<{ data: DashboardSummary }>({
    queryKey: ["admin-dashboard-summary"],
    queryFn: () =>
      customFetcher<{ data: DashboardSummary }>({ url: "/dashboard", method: "GET" }),
  });
}
