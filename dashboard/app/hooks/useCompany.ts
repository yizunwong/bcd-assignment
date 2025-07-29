import { useCompanyControllerCreate } from "@/app/api";
import { parseError } from "../utils/parseError";

export function useCreateCompanyMutation() {
  const mutation = useCompanyControllerCreate();
  return {
    ...mutation,
    createCompany: (data: FormData) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}
