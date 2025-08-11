import {
  CreatePaymentIntentDto,
  CreateTransactionDto,
  usePaymentControllerCreateIntent,
  usePaymentControllerCreate,
  usePaymentControllerFindAll,
} from "@/api";
import { parseError } from "@/utils/parseError";

export function usePaymentMutation() {
  const intentMutation = usePaymentControllerCreateIntent();
  const transactionMutation = usePaymentControllerCreate();

  return {
    ...intentMutation,
    makePayment: (data: CreatePaymentIntentDto) =>
      intentMutation.mutateAsync({ data }),
    createTransaction: (data: CreateTransactionDto) =>
      transactionMutation.mutateAsync({ data }),
  };
}

export function useFetchTransactions() {
  const query = usePaymentControllerFindAll();

  return {
    ...query,
    error: parseError(query.error),
  };
}
