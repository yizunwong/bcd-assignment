import { useActivityLogControllerFindAll, type ActivityLogControllerFindAllParams } from "@/api";
import { parseError } from "@/utils/parseError";

export function useActivityLogsQuery(params?: ActivityLogControllerFindAllParams) {
  const query = useActivityLogControllerFindAll(params);
  return {
    ...query,
    error: parseError(query.error),
  };
}
