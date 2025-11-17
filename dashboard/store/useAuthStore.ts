import { create } from "zustand";
import { z } from "zod";

const RoleSchema = z
  .enum(["policyholder", "admin", "system-admin"])
  .nullable();

export type Role = z.infer<typeof RoleSchema>;

interface AuthState {
  role?: Role;
  userId?: string;
  setRole: (role?: Role) => void;
  setUserId: (userId?: string) => void;
  clearRole: () => void;
  clearUserId: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: undefined,
  userId: undefined,
  setRole: (role) => set({ role: role ? RoleSchema.parse(role) : undefined }),
  setUserId: (userId) => set({ userId }),
  clearRole: () => set({ role: undefined }),
  clearUserId: () => set({ userId: undefined }),
}));
