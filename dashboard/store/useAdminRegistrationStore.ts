import { create } from "zustand";

export interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface UserRegistrationState {
  data: UserRegistrationData;
  setData: (data: Partial<UserRegistrationData>) => void;
  reset: () => void;
}

export const useUserRegistrationStore = create<UserRegistrationState>((set) => ({
  data: {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
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
