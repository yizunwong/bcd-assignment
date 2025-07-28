import { useAuthControllerLogin, type LoginDto } from "@/app/api";
import { useAuthControllerRegister, type RegisterDto } from "@/app/api";
import { parseError } from "@/app/utils/parseError";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  authControllerLogout,
  getAuthControllerGetMeQueryKey,
} from "@/app/api";

export function useLoginMutation() {
  const mutation = useAuthControllerLogin();

  return {
    ...mutation,
    login: (data: LoginDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useRegisterMutation() {
  const mutation = useAuthControllerRegister();

  return {
    ...mutation,
    register: (data: RegisterDto) => mutation.mutateAsync({ data }),
    error: parseError(mutation.error),
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await authControllerLogout();
      queryClient.removeQueries({
        queryKey: getAuthControllerGetMeQueryKey(),
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [queryClient]);

  return { logout };
}

export default function useAuth() {
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const { logout } = useLogout();

  const user = loginMutation.data?.data?.user;
  const isAuthenticated = !!user;

  return {
    login: loginMutation.login,
    loginError: loginMutation.error?.[0],
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.register,
    registerError: registerMutation.error?.[0],
    isRegistering: registerMutation.isPending,

    logout,
    user,
    isAuthenticated,
  };
}
