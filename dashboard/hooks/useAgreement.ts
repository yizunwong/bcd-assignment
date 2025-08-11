import { UploadDocDto, useCoverageControllerUploadAgreement } from "@/api";
import { parseError } from "@/utils/parseError";

export function useAgreementUploadMutation() {
  const mutation = useCoverageControllerUploadAgreement();

  return {
    ...mutation,
    uploadAgreement: async (agreementFile: File): Promise<string | null> => {
      if (!agreementFile) return null;

      const res = await mutation.mutateAsync({
        data: { files: [agreementFile] } as UploadDocDto,
      });

      return typeof res.data === "string" ? res.data : null;
    },
    error: parseError(mutation.error),
  };
}
