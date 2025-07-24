import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuthControllerLogin,
  useAuthControllerRegister,
  useAuthControllerGetMe,
  getAuthControllerGetMeQueryKey,
  type LoginDto,
  type RegisterDto,
} from "@/app/api";

export default function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useAuthControllerLogin();
  const registerMutation = useAuthControllerRegister();

  const login = useCallback(
    async (credentials: LoginDto) => {
      const res = await loginMutation.mutateAsync({ data: credentials });
      return res;
    },
    [loginMutation, queryClient]
  );
  

  const register = useCallback(
    async (payload: RegisterDto) => {
      return registerMutation.mutateAsync({ data: payload });
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    // Ideally, call a logout API that clears session/cookie on the server
    await fetch("/api/logout", { method: "POST" }); // optional if you have a server endpoint

    // Invalidate cached user data
    queryClient.removeQueries({ queryKey: getAuthControllerGetMeQueryKey() });
  }, [queryClient]);

  return {
    login,
    register,
    logout,
    user: loginMutation.data?.data?.user,
    isAuthenticated: loginMutation.data?.data?.accessToken ? true : false,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
  };
}
