import {
  useCompanyControllerUpload,
  useCompanyControllerCreate,
  type UploadDocDto,
  type CompanyDetailsDto,
} from "@/app/api";
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

export function useCreateCompanyMutation() {
  const mutation = useCompanyControllerCreate();
  return {
    ...mutation,
    createCompany: (data: CompanyDetailsDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}
