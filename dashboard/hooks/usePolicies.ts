import {
  usePolicyControllerFindAll,
  usePolicyControllerFindOne,
  usePolicyControllerCreate,
  usePolicyControllerUpdate,
  usePolicyControllerRemove,
  usePolicyControllerGetSummary,
  usePolicyControllerGetCategoryCounts,
  usePolicyControllerUploadDocuments,
  usePolicyControllerGetStats,
  type UploadDocDto,
  type PolicyControllerFindAllParams,
  type CreatePolicyDto,
  type UpdatePolicyDto,
  type CommonResponseDto,
} from "@/api";
import { customFetcher } from "@/api/fetch";
import { useQuery } from "@tanstack/react-query";
import { parseError } from "../utils/parseError";

interface PolicyClaimTypesDto {
  id: number;
  name: string;
  claim_types: string[];
}

export function usePoliciesQuery(params?: PolicyControllerFindAllParams) {
  const query = usePolicyControllerFindAll(params);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function usePolicyQuery(id: number) {
  const query = usePolicyControllerFindOne(id);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCreatePolicyMutation() {
  const mutation = usePolicyControllerCreate();
  return {
    ...mutation,
    createPolicy: (data: CreatePolicyDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useUpdatePolicyMutation() {
  const mutation = usePolicyControllerUpdate();
  return {
    ...mutation,
    updatePolicy: (id: string, data: UpdatePolicyDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}

export function useRemovePolicyMutation() {
  const mutation = usePolicyControllerRemove();
  return {
    ...mutation,
    removePolicy: (id: string) => mutation.mutateAsync({ id }),
    error: parseError(mutation.error),
  };
}

export function usePolicySummaryQuery(id: string) {
  const query = usePolicyControllerGetSummary(id);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCategoryCountsQuery() {
  const query = usePolicyControllerGetCategoryCounts();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function usePolicyStatsQuery() {
  const query = usePolicyControllerGetStats();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function usePolicyClaimTypesQuery() {
  const query = useQuery({
    queryKey: ["policy-claim-types"],
    queryFn: () =>
      customFetcher<CommonResponseDto<PolicyClaimTypesDto[]>>({
        url: "/policy/claim-types",
        method: "GET",
      }),
  });

  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useUploadPolicyDocumentsMutation() {
  const mutation = usePolicyControllerUploadDocuments();
  return {
    ...mutation,
    uploadPolicyDocuments: (id: string, data: UploadDocDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}
