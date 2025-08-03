import { CreatePaymentIntentDto, usePaymentControllerCreateIntent } from "@/api";

export function usePaymentMutation() {
  const mutation = usePaymentControllerCreateIntent();

  return {
    ...mutation,
    makePayment: (data: CreatePaymentIntentDto) =>
      mutation.mutateAsync({ data }),
  };
}
