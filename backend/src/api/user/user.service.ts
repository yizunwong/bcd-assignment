import { Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/supabase/types/supabase.exception';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { Tables } from 'src/supabase/types/supabase.types';

export type User = Tables<'users'>;

@Injectable()
export class UserService {
  async getAllUsers(req: AuthenticatedRequest): Promise<User[]> {
    const { data, error } = await req.supabase.from('users').select('*');
    if (error || !data) {
      throw new SupabaseException('Failed to fetch users', error);
    }
    return data;
  }

  async getUserById(req: AuthenticatedRequest, id: number): Promise<User> {
    const { data, error } = await req.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new SupabaseException(`User with ID ${id} not found`, error);
    }
    return data;
  }

  async createUser(
    req: AuthenticatedRequest,
    user: Pick<User, 'email'>,
  ): Promise<User> {
    const { data, error } = await req.supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    if (error || !data) {
      throw new SupabaseException('Failed to create user', error);
    }
    return data;
  }
}
