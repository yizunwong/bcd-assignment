import { create } from "zustand";

export interface AdminRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AdminRegistrationState {
  data: AdminRegistrationData;
  setData: (data: Partial<AdminRegistrationData>) => void;
  reset: () => void;
}

export const useAdminRegistrationStore = create<AdminRegistrationState>((set) => ({
  data: {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
  setData: (data) =>
    set((state) => ({ data: { ...state.data, ...data } })),
  reset: () =>
    set({
      data: {
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
      },
    }),
}));
