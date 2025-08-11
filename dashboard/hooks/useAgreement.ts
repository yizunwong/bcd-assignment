import { customFetcher } from "@/api/fetch";
import { parseError } from "@/utils/parseError";
import { useMutation } from "@tanstack/react-query";

interface UploadAgreementResponse {
  data?: string;
}

export function useAgreementUploadMutation() {
  const mutation = useMutation({
    mutationFn: async (agreementFile: File) => {
      const formData = new FormData();
      formData.append("file", agreementFile);

      return customFetcher<UploadAgreementResponse>({
        url: "/coverage/agreement",
        method: "POST",
        data: formData,
      });
    },
  });

  return {
    ...mutation,
    uploadAgreement: async (agreementFile: File): Promise<string | null> => {
      if (!agreementFile) return null;

      const res = await mutation.mutateAsync(agreementFile);

      return typeof res?.data === "string" ? res.data : null;
    },
    error: parseError(mutation.error),
  };
}
