import { UsersApi } from '@/api-client';
import { config } from '../services';

export const usersApi = new UsersApi(config);
