import { create } from "zustand";
import { z } from "zod";

const RoleSchema = z.enum(["policyholder", "admin", "system-admin"]);

export type Role = z.infer<typeof RoleSchema>;

interface AuthState {
  role?: Role;
  setRole: (role?: Role) => void;
  clearRole: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: undefined,
  setRole: (role) => set({ role: role ? RoleSchema.parse(role) : undefined }),
  clearRole: () => set({ role: undefined }),
}));
