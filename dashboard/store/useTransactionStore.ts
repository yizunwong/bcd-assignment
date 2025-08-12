import { create } from "zustand";

// Matches the Supabase transaction table structure
export interface TransactionInfo {
  id: number; // Supabase transaction ID
  coverageId: number; // Associated coverage
  txHash: string; // Blockchain transaction hash
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
  id: 0,
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

