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

  const meQuery = useAuthControllerGetMe(
    {
      query: {
        enabled:
          typeof window !== "undefined" &&
          !!localStorage.getItem("access_token"),
      },
    },
    queryClient,
  );

  const login = useCallback(
    async (credentials: LoginDto) => {
      const res = await loginMutation.mutateAsync({ data: credentials });
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem("access_token", token);
        await queryClient.invalidateQueries(getAuthControllerGetMeQueryKey());
      }
      return res;
    },
    [loginMutation, queryClient],
  );

  const register = useCallback(
    async (payload: RegisterDto) => {
      return registerMutation.mutateAsync({ data: payload });
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    queryClient.removeQueries({ queryKey: getAuthControllerGetMeQueryKey() });
  }, [queryClient]);

  return {
    login,
    register,
    logout,
    user: meQuery.data?.data,
    isAuthenticated: !!meQuery.data?.data,
    isLoadingUser: meQuery.isLoading,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
  };
}
