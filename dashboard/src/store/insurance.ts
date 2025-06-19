import { create } from "zustand";

export type InsurancePlan =
  | "medical"
  | "flight"
  | "travel"
  | "life"
  | "accident";

interface InsuranceState {
  selectedPlan: InsurancePlan;
  setSelectedPlan: (plan: InsurancePlan) => void;
}

export const useInsuranceStore = create<InsuranceState>((set) => ({
  selectedPlan: "medical",
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));
