import { useMutation } from "@tanstack/react-query";
import { LoginDto, LoginResponseDto } from "@/api-client/types";
import { authControllerLogin } from '@/api-client/endpoints';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authControllerLogin(credentials),
    onSuccess: (data : LoginResponseDto) => {
      localStorage.setItem("access_token", data.accessToken);
      console.log("Login success:", data);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
    },
  });
};
