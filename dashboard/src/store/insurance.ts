import create from 'zustand'

export type InsurancePlan = 'basic' | 'premium' | 'platinum'

interface InsuranceState {
  selectedPlan: InsurancePlan
  setSelectedPlan: (plan: InsurancePlan) => void
}

export const useInsuranceStore = create<InsuranceState>((set) => ({
  selectedPlan: 'basic',
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}))
