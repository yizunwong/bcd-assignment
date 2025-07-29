import {
  useCoverageControllerFindAll,
  useCoverageControllerFindOne,
  useCoverageControllerCreate,
  useCoverageControllerUpdate,
  useCoverageControllerRemove,
  useCoverageControllerGetPolicyholderSummary,
  type CoverageControllerFindAllParams,
  type CreateCoverageDto,
  type UpdateCoverageDto,
} from "@/api";
import { parseError } from "../utils/parseError";

export function useCoverageListQuery(params?: CoverageControllerFindAllParams) {
  const query = useCoverageControllerFindAll(params);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCoverageQuery(id: string) {
  const query = useCoverageControllerFindOne(id);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCreateCoverageMutation() {
  const mutation = useCoverageControllerCreate();
  return {
    ...mutation,
    createCoverage: (data: CreateCoverageDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useUpdateCoverageMutation() {
  const mutation = useCoverageControllerUpdate();
  return {
    ...mutation,
    updateCoverage: (id: string, data: UpdateCoverageDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}

export function useRemoveCoverageMutation() {
  const mutation = useCoverageControllerRemove();
  return {
    ...mutation,
    removeCoverage: (id: string) => mutation.mutateAsync({ id }),
    error: parseError(mutation.error),
  };
}

export function usePolicyholderSummaryQuery() {
  const query = useCoverageControllerGetPolicyholderSummary();
  return {
    ...query,
    error: parseError(query.error),
  };
}
