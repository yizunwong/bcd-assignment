import {
  useReviewsControllerLeaveReview,
  type CreateReviewDto,
} from "@/app/api";
import { parseError } from "../utils/parseError";

export function useLeaveReviewMutation() {
  const mutation = useReviewsControllerLeaveReview();
  return {
    ...mutation,
    leaveReview: (id: string, data: CreateReviewDto) =>
      mutation.mutateAsync({ id, data }),
    error: parseError(mutation.error),
  };
}
