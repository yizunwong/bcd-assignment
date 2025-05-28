import { Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/common/supabase.exception';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Tables } from 'src/supabase/supabase.types';
import { AuthenticatedRequest } from '../auth/auth.guard';

export type User = Tables<'users'>;

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(req: AuthenticatedRequest): Promise<User[]> {
    const supabase = this.supabaseService.getClient(req);
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) {
      throw new SupabaseException('Failed to fetch users', error);
    }
    return data;
  }

  async getUserById(req: AuthenticatedRequest, id: number): Promise<User> {
    const supabase = this.supabaseService.getClient(req);
    const { data, error } = await supabase
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
    const supabase = this.supabaseService.getClient(req);
    const { data, error } = await supabase
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
