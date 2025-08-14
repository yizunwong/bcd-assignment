import {
  CreatePaymentIntentDto,
  CreateTransactionDto,
  usePaymentControllerCreateIntent,
  usePaymentControllerCreate,
  usePaymentControllerFindAll,
  usePaymentControllerFindOne,
  usePaymentControllerGetStats,
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

export function useTransactionsQuery() {
  const query = usePaymentControllerFindAll();

  return {
    ...query,
    error: parseError(query.error),
  };
}

export function usePaymentStatsQuery() {
  const query = usePaymentControllerGetStats();
  return {
    ...query,
    error: parseError(query.error),
  };
}

export function useTransactionQuery(txHash: string, options?: any) {
  const query = usePaymentControllerFindOne(txHash, options);
  return {
    ...query,
    error: parseError(query.error),
  };
}
