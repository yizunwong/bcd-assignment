import { useQuery } from "@tanstack/react-query";
import { customFetcher } from "@/api/fetch";
import type { CommonResponseDto } from "@/api";
import { parseError } from "@/utils/parseError";
import type { WalletTransaction } from "./useWalletTransactions";

interface BackendTransaction {
  id: number;
  coverage_id: number;
  tx_hash: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
}

export function useFetchTransactions() {
  const query = useQuery<CommonResponseDto<BackendTransaction[]>>({
    queryKey: ["wallet-transactions"],
    queryFn: () =>
      customFetcher({ url: "/payments/transactions", method: "GET" }),
  });

  const transactions: WalletTransaction[] =
    query.data?.data.map((tx) => ({
      id: tx.tx_hash,
      type: tx.type as WalletTransaction["type"],
      amount: `${tx.amount} ${tx.currency}`,
      description: "Recorded transaction",
      date: tx.created_at.split("T")[0],
      status: tx.status as WalletTransaction["status"],
      hash: tx.tx_hash,
    })) ?? [];

  return { ...query, transactions, error: parseError(query.error) };
}
