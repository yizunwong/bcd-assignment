import { Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/supabase/types/supabase.exception';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CreateUserDto } from './dto/requests/create.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(req: AuthenticatedRequest) {
    const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Get user_profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profileError || !profiles) {
      throw new SupabaseException(
        'Failed to fetch user_profiles',
        profileError,
      );
    }

    // Step 2: Get auth.users (with service role key)
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError || !authUsers?.users) {
      throw new SupabaseException('Failed to fetch auth users', authError);
    }

    // Step 3: Merge profiles + auth.users
    const merged = profiles.map((profile) => {
      const auth = authUsers.users.find((u) => u.id === profile.user_id);

      return {
        id: profile.id,
        name: auth?.user_metadata?.username ?? 'Unknown',
        email: auth?.email ?? '—',
        role: profile.role,
        status: profile.status,
        twoFactorEnabled: !!auth?.factors?.length,
        joinDate: profile.join_date,
        lastLogin: auth?.last_sign_in_at,
        policies: profile.policies ?? 0,
        claims: profile.claims ?? 0,
      };
    });

    return merged;
  }

  async getUserById(req: AuthenticatedRequest, id: number) {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new SupabaseException(`User with ID ${id} not found`, error);
    }
    return data;
  }

  async createUser(req: AuthenticatedRequest, body: CreateUserDto) {
    const { email, password, ...profile } = body;

    // Step 1: Create the Auth User
    const { data: userData, error: authError } =
      await req.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: profile.role },
      });

    if (authError || !userData?.user) {
      throw new SupabaseException('Failed to create auth user', authError);
    }

    const user_id = userData.user.id;

    // Step 2: Create the user profile
    const { data: profileData, error: profileError } = await req.supabase
      .from('user_profiles')
      .insert([
        {
          ...profile,
          user_id,
          join_date: new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (profileError || !profileData) {
      throw new SupabaseException(
        'Failed to create user profile',
        profileError,
      );
    }

    return profileData;
  }
}
