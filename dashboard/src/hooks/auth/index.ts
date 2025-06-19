import { LoginDto, authControllerLogin, RegisterDto, authControllerRegister, AuthControllerLogin200AllOf } from '@/api-client/api';
import { useMutation } from '@tanstack/react-query';

// Login Mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authControllerLogin(credentials),
    onSuccess: (res: AuthControllerLogin200AllOf) => {
      localStorage.setItem("access_token", res.data!.accessToken);
      console.log("Login success:", res);
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
