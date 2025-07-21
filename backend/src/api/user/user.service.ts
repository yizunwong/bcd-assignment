import { Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/supabase/types/supabase.exception';
import { CreateUserDto, UserRole, UserStatus } from './dto/requests/create.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers() {
    const supabase = this.supabaseService.createClientWithToken();

    const { data: profiles, error: profileError } = await supabase
      .from('user_details')
      .select('user_id, first_name, last_name, status, phone');

    if (profileError || !profiles) {
      throw new SupabaseException(
        'Failed to fetch user_profiles',
        profileError,
      );
    }

    type Profile = {
      user_id: string;
      first_name?: string;
      last_name?: string;
      status?: UserStatus;
      phone?: string | null;
    };

    const typedProfiles: Profile[] = Array.isArray(profiles) ? profiles as Profile[] : [];

    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError || !authUsers?.users) {
      throw new SupabaseException('Failed to fetch auth users', authError);
    }

    const merged = typedProfiles.map((profile) => {
      const auth = authUsers.users.find((u) => u.id === profile.user_id);
      return {
        user_id: profile.user_id,
        email: auth?.email ?? '—',
        name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
        role: (auth?.app_metadata as { role?: UserRole })?.role,
        phone: profile.phone ?? null,
        status: (profile.status as UserStatus) ?? UserStatus.ACTIVE,
        lastLogin: auth?.last_sign_in_at,
        joinedAt: auth?.created_at,
      };
    });

    return merged;
  }

  async getUserById(user_id: string) {
    const supabase = this.supabaseService.createClientWithToken();
    // Step 1: Get user_details and joined role details
    const { data: profile, error: profileError } = await supabase
      .from('user_details')
      .select(
        `
      user_id,
      first_name,
      last_name,
      status,
      phone,
      bio,
      admin_details (
        employee_id,
        license_no,
        company_name,
        company_address
      ),
      policyholder_details (
        date_of_birth,
        occupation,
        address
      )
    `,
      )
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      throw new SupabaseException(
        `User with ID ${user_id} not found`,
        profileError,
      );
    }

    // Step 2: Get auth.users (for email, login data)
    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(user_id);

    if (authError || !authUser?.user) {
      throw new SupabaseException(
        `Failed to fetch auth metadata for ${user_id}`,
        authError,
      );
    }

    const role = (authUser.user.app_metadata as { role?: UserRole })?.role;

    // Step 3: Build return object
    const basicInfo = {
      user_id,
      email: authUser.user.email ?? '—',
      name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
      role: role ?? UserRole.POLICYHOLDER,
      phone: (profile as { phone?: string }).phone,
      bio: (profile as { bio?: string }).bio,
      status: (profile.status as UserStatus) ?? UserStatus.ACTIVE,
      lastLogin: authUser.user.last_sign_in_at,
      joinedAt: authUser.user.created_at,
    };

    type AdminDetails = {
      employeeId?: string;
      licenseNumber?: string;
      companyName?: string;
      companyAddress?: string;
    };

    type PolicyholderDetails = {
      dateOfBirth?: string;
      occupation?: string;
      address?: string;
    };

    let details: AdminDetails | PolicyholderDetails | null = null;

    if (
      role === UserRole.INSURANCE_ADMIN &&
      profile.admin_details &&
      typeof profile.admin_details === 'object' &&
      !('code' in profile.admin_details)
    ) {
      details = {
        employeeId: (profile.admin_details as { employee_id?: string })
          .employee_id,
        licenseNumber: (profile.admin_details as { license_no?: string })
          .license_no,
        companyName: (profile.admin_details as { company_name?: string })
          .company_name,
        companyAddress: (profile.admin_details as { company_address?: string })
          .company_address,
      };
    }

    if (
      role === UserRole.POLICYHOLDER &&
      profile.policyholder_details &&
      typeof profile.policyholder_details === 'object' &&
      !('code' in profile.policyholder_details)
    ) {
      const policyholderDetails = profile.policyholder_details as {
        date_of_birth?: string;
        occupation?: string;
        address?: string;
      };
      details = {
        dateOfBirth: policyholderDetails.date_of_birth,
        occupation: policyholderDetails.occupation,
        address: policyholderDetails.address,
      };
    }

    return {
      ...basicInfo,
      details: details,
    };
  }

  async createUser(dto: CreateUserDto) {
    const authUser = await this.createAuthUser(dto);
    const user_id = authUser.user.id;

    const profile = await this.createUserProfile(user_id, dto);
    const details = await this.createRoleSpecificDetails(user_id, dto);

    return {
      user_id,
      email: authUser.user.email,
      role: (authUser.user.app_metadata as { role?: UserRole })?.role,
      phone: authUser.user.phone,
      profile,
      details,
    };
  }

  private async createAuthUser(dto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = dto;
    const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
      user_metadata: { username: `${firstName} ${lastName}` },
    });

    if (error || !data?.user) {
      throw new SupabaseException('Failed to create auth user', error);
    }

    return data;
  }

  private async createUserProfile(user_id: string, dto: CreateUserDto) {
    const { bio, firstName, lastName } = dto;
    const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await supabase
      .from('user_details')
      .insert([
        {
          user_id,
          status: UserStatus.ACTIVE,
          bio: bio ?? null,
          first_name: firstName ?? null,
          last_name: lastName ?? null,
          phone: dto.phone ?? null,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new SupabaseException('Failed to create user profile', error);
    }

    return data;
  }

  private async createRoleSpecificDetails(user_id: string, dto: CreateUserDto) {
    const supabase = this.supabaseService.createClientWithToken();

    if (dto.role === UserRole.INSURANCE_ADMIN) {
      const { employeeId, licenseNumber, companyName, companyAddress } = dto;

      const { data, error } = await supabase
        .from('admin_details')
        .insert([
          {
            user_id,
            employee_id: employeeId,
            license_no: licenseNumber,
            company_name: companyName ?? '',
            company_address: companyAddress ?? '',
          },
        ])
        .select()
        .single();

      if (error) {
        throw new SupabaseException('Failed to create admin details', error);
      }

      return data;
    }

    if (dto.role === UserRole.POLICYHOLDER) {
      const { dateOfBirth, occupation, address } = dto;

      const { data, error } = await supabase
        .from('policyholder_details')
        .insert([
          {
            user_id,
            date_of_birth: dateOfBirth,
            occupation: occupation ?? '',
            address: address ?? '',
          },
        ])
        .select()
        .single();

      if (error) {
        throw new SupabaseException(
          'Failed to create policyholder details',
          error,
        );
      }

      return data;
    }

    return null;
  }

  async getUserStats() {
    // Step 1: Get total users
    const supabase = this.supabaseService.createClientWithToken();

    const { count: totalUsers, error: totalError } = await supabase
      .from('user_details')
      .select('user_id', { count: 'exact', head: true });

    if (totalError) {
      throw new SupabaseException('Failed to count total users', totalError);
    }

    // Step 2: Get active users
    const { count: activeUsers, error: activeError } = await supabase
      .from('user_details')
      .select('user_id', { count: 'exact', head: true })
      .eq('status', 'active');

    if (activeError) {
      throw new SupabaseException('Failed to count active users', activeError);
    }

    // Step 3: Count policyholders
    const { count: policyholders, error: policyError } = await supabase
      .from('policyholder_details')
      .select('user_id', { count: 'exact', head: true });

    if (policyError) {
      throw new SupabaseException('Failed to count policyholders', policyError);
    }

    // Step 4: Count insurance admins
    const { count: admins, error: adminError } = await supabase
      .from('admin_details')
      .select('user_id', { count: 'exact', head: true });

    if (adminError) {
      throw new SupabaseException(
        'Failed to count insurance admins',
        adminError,
      );
    }

    return {
      totalUsers,
      activeUsers,
      policyholders,
      insuranceAdmins: admins,
    };
  }
}
