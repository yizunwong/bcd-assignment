import { create } from "zustand";

export interface TransactionInfo {
  policyId: string;
  transactionId: string;
  blockHash: string;
  amount: number;
  usdAmount: number;
  paymentMethod: string;
  timestamp: string;
  status: string;
  confirmations: number;
}

interface TransactionState {
  data: TransactionInfo;
  setData: (data: Partial<TransactionInfo>) => void;
  reset: () => void;
}

const initialData: TransactionInfo = {
  policyId: "",
  transactionId: "",
  blockHash: "",
  amount: 0,
  usdAmount: 0,
  paymentMethod: "",
  timestamp: "",
  status: "",
  confirmations: 0,
};

export const useTransactionStore = create<TransactionState>((set) => ({
  data: initialData,
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  reset: () => set({ data: initialData }),
}));

