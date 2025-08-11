import { UploadDocDto, useCoverageControllerUploadAgreement } from "@/api";
import { parseError } from "@/utils/parseError";

export function useAgreementUploadMutation() {
  const mutation = useCoverageControllerUploadAgreement();

  return {
    ...mutation,
    uploadAgreement: (agreementFile: UploadDocDto) =>
      mutation.mutateAsync({ data: agreementFile }),
    error: parseError(mutation.error),
  };
}
