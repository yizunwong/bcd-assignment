import {
  useClaimControllerFindAll,
  useClaimControllerFindOne,
  useClaimControllerCreate,
  useClaimControllerUpdate,
  useClaimControllerRemove,
  useClaimControllerUpdateClaimStatus,
  useClaimControllerRemoveFile,
  useClaimControllerUploadDocuments,
  type UploadDocDto,
  type ClaimControllerFindAllParams,
  type CreateClaimDto,
  type UpdateClaimDto,
  ClaimStatus,
  useClaimControllerGetStats,
  useClaimControllerGetClaimDetails,
} from "@/api";
import { parseError } from "../utils/parseError";

export function useClaimsQuery(params?: ClaimControllerFindAllParams) {
  const query = useClaimControllerFindAll(params);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useClaimQuery(id: string) {
  const query = useClaimControllerFindOne(id);
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useCreateClaimMutation() {
  const mutation = useClaimControllerCreate();
  return {
    ...mutation,
    createClaim: (data: CreateClaimDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useClaimStatsQuery() {
  const query = useClaimControllerGetStats();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useClaimDetailsQuery() {
  const query = useClaimControllerGetClaimDetails();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useUpdateClaimMutation() {
  const mutation = useClaimControllerUpdate();
  return {
    ...mutation,
    updateClaim: (id: string, data: UpdateClaimDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}

export function useRemoveClaimMutation() {
  const mutation = useClaimControllerRemove();
  return {
    ...mutation,
    removeClaim: (id: string) => mutation.mutateAsync({ id }),
    error: parseError(mutation.error),
  };
}

export function useUpdateClaimStatusMutation() {
  const mutation = useClaimControllerUpdateClaimStatus();
  return {
    ...mutation,
    updateClaimStatus: (id: string, status: ClaimStatus) =>
      mutation.mutateAsync({ id, status }),
    error: parseError(mutation.error),
  };
}

export function useRemoveClaimFileMutation() {
  const mutation = useClaimControllerRemoveFile();
  return {
    ...mutation,
    removeClaimFile: (id: string) => mutation.mutateAsync({ id }),
    error: parseError(mutation.error),
  };
}

export function useUploadClaimDocumentsMutation() {
  const mutation = useClaimControllerUploadDocuments();
  return {
    ...mutation,
    uploadClaimDocuments: (id: string, data: UploadDocDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}
