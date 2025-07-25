import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuthControllerLogin,
  useAuthControllerRegister,
  getAuthControllerGetMeQueryKey,
  authControllerLogout, // ✅ Import this
  type LoginDto,
  type RegisterDto,
} from "@/app/api";
import { parseError } from '../utils/parseError';

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
    try {
      // ✅ Call the actual logout API to clear cookie
      await authControllerLogout();

      // ❌ Clear cached auth user data
      queryClient.removeQueries({
        queryKey: getAuthControllerGetMeQueryKey(),
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, [queryClient]);

  return {
    login,
    register,
    logout,
    user: loginMutation.data?.data?.user,
    isAuthenticated: loginMutation.data?.data?.accessToken ? true : false,
    loginError: parseError(loginMutation.error),
    isLoggingIn: loginMutation.isPending,
    registerError: parseError(registerMutation.error),
    isRegistering: registerMutation.isPending,
  };
}
