import {
  usePdfClaimExtractorControllerExtract,
  type ExtractClaimDto,
} from "@/api";
import { parseError } from "../utils/parseError";

export function useExtractClaimMutation() {
  const mutation = usePdfClaimExtractorControllerExtract();
  return {
    ...mutation,
    extractClaim: (data: ExtractClaimDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}
