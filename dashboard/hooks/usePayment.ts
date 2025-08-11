import {
  CreatePaymentIntentDto,
  CreateTransactionDto,
  usePaymentControllerCreateIntent,
  usePaymentControllerCreate,
} from "@/api";

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
