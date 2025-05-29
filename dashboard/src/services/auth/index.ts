import { AuthApi } from '@/api-client';
import { config } from '../services';

export const authApi = new AuthApi(config);

export async function login(email: string, password: string) {
  const result = await authApi.authControllerLogin({
    signInDto: {
      email,
      password,
    },
  });


  return result;
}