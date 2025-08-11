import { UploadDocDto, useCoverageControllerUploadAgreement } from "@/api";
import { parseError } from "@/utils/parseError";

export function useAgreementUploadMutation() {
  const mutation = useCoverageControllerUploadAgreement();

  return {
    ...mutation,
    uploadAgreement: async (agreementFile: File): Promise<string | null> => {
      const res = await mutation.mutateAsync({
        data: { files: [agreementFile] },
      });

      return res.data;
    },
    error: parseError(mutation.error),
  };
}
