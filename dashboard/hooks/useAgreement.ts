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

      return (res as any)?.data || null;
    },
    error: parseError(mutation.error),
  };
}
