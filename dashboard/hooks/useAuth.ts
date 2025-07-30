import { useAuthControllerLogin, type LoginDto } from "@/api";
import { useAuthControllerRegister, type RegisterDto } from "@/api";
import { parseError } from "@/utils/parseError";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  authControllerLogout,
  getAuthControllerGetMeQueryKey,
  useAuthControllerGetMe,
} from "@/api";

export function useLoginMutation() {
  const mutation = useAuthControllerLogin();

  return {
    ...mutation,
    login: (data: LoginDto) => mutation.mutateAsync({ data }),
  };
}

export function useRegisterMutation() {
  const mutation = useAuthControllerRegister();

  return {
    ...mutation,
    register: (data: RegisterDto) => mutation.mutateAsync({ data }),
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

export function useMeQuery() {
  const query = useAuthControllerGetMe();

  return {
    ...query,
    error: parseError(query.error),
  };
}

export default function useAuth() {
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const { logout } = useLogout();

  const user = loginMutation.data?.data?.user;
  const isAuthenticated = !!user;

  return {
    login: loginMutation.login,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.register,
    isRegistering: registerMutation.isPending,

    logout,
    user,
    isAuthenticated,
  };
}
