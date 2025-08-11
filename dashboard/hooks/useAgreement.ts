import { UploadDocDto, useCoverageControllerUploadAgreement } from "@/api";
import { parseError } from "@/utils/parseError";

export function useAgreementUploadMutation() {
  const mutation = useCoverageControllerUploadAgreement();

  return {
    ...mutation,
    uploadAgreement: async (agreementFile: File) => {
      const res = await mutation.mutateAsync({
        data: { files: [agreementFile] } as UploadDocDto,
      });
      return res.data as string;
    },
    error: parseError(mutation.error),
  };
}
