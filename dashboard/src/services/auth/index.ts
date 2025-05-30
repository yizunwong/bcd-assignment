import { useMutation } from "@tanstack/react-query";
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
} from "@/api-client/types";
import {
  authControllerLogin,
  authControllerRegister,
} from "@/api-client/endpoints";

// Login Mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authControllerLogin(credentials),
    onSuccess: (data: LoginResponseDto) => {
      localStorage.setItem("access_token", data.accessToken);
      console.log("Login success:", data);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
    },
  });
};

// Register Mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterDto) =>
      authControllerRegister(credentials),
    onSuccess: () => {
      console.log("Registration success:");
    },
    onError: (error: Error) => {
      console.error("Registration failed:", error.message);
    },
  });
};

// Main hook that exports both
export const useAuthMutations = () => {
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  return {
    login: loginMutation,
    register: registerMutation,
  };
};
