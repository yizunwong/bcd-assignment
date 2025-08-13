import { create } from "zustand";

// Matches the Supabase transaction table structure
export interface TransactionInfo {
  coverageId: number; 
  txHash: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
}

interface TransactionState {
  data: TransactionInfo;
  setData: (data: Partial<TransactionInfo>) => void;
  reset: () => void;
}

const initialData: TransactionInfo = {
  coverageId: 0,
  txHash: "",
  description: "",
  amount: 0,
  currency: "",
  status: "",
  type: "",
  createdAt: "",
};

export const useTransactionStore = create<TransactionState>((set) => ({
  data: initialData,
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  reset: () => set({ data: initialData }),
}));

