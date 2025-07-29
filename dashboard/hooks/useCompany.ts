import { useCompanyControllerUpload, type UploadDocDto } from "@/api";
import { parseError } from "../utils/parseError";

export function useCompanyUploadMutation() {
  const mutation = useCompanyControllerUpload();
  return {
    ...mutation,
    uploadCompanyDocuments: (id: string, data: UploadDocDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}
