import { Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/supabase/types/supabase.exception';
import {
  AdminDetails,
  CreateUserDto,
  PolicyholderDetails,
  UserRole,
  UserStatus,
} from './dto/requests/create.dto';
import { UpdateUserDto } from './dto/requests/update.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Database } from 'src/supabase/types/supabase.types';
import { parseAppMetadata } from 'src/utils/auth-metadata';
import { CommonResponseDto } from 'src/common/common.dto';
import { UserResponseDto } from './dto/respond/user.dto';
import { UserStatsResponseDto } from './dto/respond/user-stats.dto';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(): Promise<CommonResponseDto<UserResponseDto[]>> {
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

    type Profile = Pick<
      Database['public']['Tables']['user_details']['Row'],
      'user_id' | 'first_name' | 'last_name' | 'status' | 'phone'
    >;

    const typedProfiles: Profile[] = Array.isArray(profiles) ? profiles : [];

    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError || !authUsers?.users) {
      throw new SupabaseException('Failed to fetch auth users', authError);
    }

    console.log(authUsers.users);

    const merged = typedProfiles.map((profile) => {
      const auth = authUsers.users.find((u) => u.id === profile.user_id);
      return new UserResponseDto({
        user_id: profile.user_id,
        email: auth?.email ?? '—',
        name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
        role:
          parseAppMetadata(auth?.app_metadata).role ?? UserRole.POLICYHOLDER,
        phone: profile.phone ?? null,
        status: (profile.status as UserStatus) ?? UserStatus.ACTIVE,
        lastLogin: auth?.last_sign_in_at,
        joinedAt: auth?.created_at,
        bio: null,
      });
    });

    return new CommonResponseDto<UserResponseDto[]>({
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: merged,
      count: merged.length,
    });
  }

  async getUserById(
    user_id: string,
  ): Promise<CommonResponseDto<UserResponseDto>> {
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
        company:companies (
          name,
          address,
          license_number,
          contact_no,
          website,
          years_in_business
        )
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

    const role = parseAppMetadata(authUser.user.app_metadata).role;

    // Step 3: Build return object
    const basicInfo = {
      user_id,
      email: authUser.user.email ?? '—',
      name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
      role:
        parseAppMetadata(authUser.user.app_metadata).role ??
        UserRole.POLICYHOLDER,
      phone: profile.phone ?? null,
      bio: profile.bio ?? null,
      status: profile.status ?? UserStatus.ACTIVE,
      lastLogin: authUser.user.last_sign_in_at,
      joinedAt: authUser.user.created_at,
    };
    let details: AdminDetails | PolicyholderDetails | null = null;
    if (
      role === UserRole.INSURANCE_ADMIN &&
      profile.admin_details &&
      typeof profile.admin_details === 'object' &&
      !('code' in profile.admin_details)
    ) {
      details = {
        company: {
          name: profile.admin_details.company?.name,
          address: profile.admin_details.company?.address,
          license_number: profile.admin_details.company?.license_number,
          contact_no: profile.admin_details.company?.contact_no,
          website: profile.admin_details.company?.website,
          years_in_business: profile.admin_details.company?.years_in_business,
        },
      };
    }

    if (
      role === UserRole.POLICYHOLDER &&
      profile.policyholder_details &&
      typeof profile.policyholder_details === 'object' &&
      !('code' in profile.policyholder_details)
    ) {
      details = {
        date_of_birth: profile.policyholder_details.date_of_birth,
        occupation: profile.policyholder_details.occupation!,
        address: profile.policyholder_details.address,
      };
    }

    return new CommonResponseDto<UserResponseDto>({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: new UserResponseDto({
        ...basicInfo,
        details: details,
      }),
    });
  }

  async createUser(
    dto: CreateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    const supabase = this.supabaseService.createClientWithToken();

    const authUser = await this.createAuthUser(supabase, dto);
    const user_id = authUser.user.id;

    const profile = await this.createUserProfile(supabase, user_id, dto);
    const details = await this.createRoleSpecificDetails(
      supabase,
      user_id,
      dto,
    );

    return new CommonResponseDto<UserResponseDto>({
      statusCode: 201,
      message: 'User created successfully',
      data: new UserResponseDto({
        user_id,
        email: authUser.user.email ?? '',
        name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
        role:
          parseAppMetadata(authUser.user.app_metadata).role ??
          UserRole.POLICYHOLDER,
        phone: profile.phone ?? null,
        bio: dto.bio ?? null,
        status: UserStatus.ACTIVE,
        lastLogin: authUser.user.last_sign_in_at,
        joinedAt: authUser.user.created_at,
        details,
      }),
    });
  }

  private async createAuthUser(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    dto: CreateUserDto,
  ) {
    const { email, password, role } = dto;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
    });

    if (error || !data?.user) {
      throw new SupabaseException('Failed to create auth user', error);
    }

    return data;
  }

  private async createUserProfile(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    user_id: string,
    dto: CreateUserDto,
  ) {
    const { bio, firstName, lastName } = dto;

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

  private async createRoleSpecificDetails(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    user_id: string,
    dto: CreateUserDto,
  ) {
    if (dto.role === UserRole.INSURANCE_ADMIN) {
      const { company } = dto;

      if (!company) {
        throw new SupabaseException(
          'Company information is required for insurance admin',
        );
      }

      // Safe to proceed — company is guaranteed
      const { data: insertedCompany, error: companyError } = await supabase
        .from('companies')
        .insert([company])
        .select('id')
        .single();

      if (companyError || !insertedCompany?.id) {
        throw new SupabaseException('Failed to insert company', companyError);
      }

      const company_id = insertedCompany.id;

      const { data, error } = await supabase
        .from('admin_details')
        .insert([
          {
            user_id,
            company_id,
            verified_at: null,
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

  async updateUser(
    user_id: string,
    dto: UpdateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    const supabase = this.supabaseService.createClientWithToken();

    const authUpdates: Record<string, any> = {};
    if (dto.email !== undefined) authUpdates.email = dto.email;
    if (dto.password !== undefined) authUpdates.password = dto.password;
    if (dto.role !== undefined) {
      authUpdates.app_metadata = { role: dto.role };
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        user_id,
        authUpdates,
      );
      if (authError) {
        throw new SupabaseException('Failed to update auth user', authError);
      }
    }

    const profileUpdates: Database['public']['Tables']['user_details']['Update'] =
      {};
    if (dto.firstName !== undefined) profileUpdates.first_name = dto.firstName;
    if (dto.lastName !== undefined) profileUpdates.last_name = dto.lastName;
    if (dto.phone !== undefined) profileUpdates.phone = dto.phone;
    if (dto.bio !== undefined) profileUpdates.bio = dto.bio;
    if (dto.status !== undefined) profileUpdates.status = dto.status;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('user_details')
        .update(profileUpdates)
        .eq('user_id', user_id);

      if (profileError) {
        throw new SupabaseException(
          'Failed to update user profile',
          profileError,
        );
      }
    }

    if (dto.role === UserRole.INSURANCE_ADMIN) {
      const adminUpdates: Database['public']['Tables']['admin_details']['Update'] & {
        user_id: string;
      } = { user_id };

      if (Object.keys(adminUpdates).length > 1) {
        const { error: adminError } = await supabase
          .from('admin_details')
          .update(adminUpdates);

        if (adminError) {
          throw new SupabaseException(
            'Failed to update admin details',
            adminError,
          );
        }
      }
    }

    if (dto.role === UserRole.POLICYHOLDER) {
      const holderUpdates: Database['public']['Tables']['policyholder_details']['Update'] & {
        user_id: string;
      } = { user_id };
      if (dto.dateOfBirth !== undefined)
        holderUpdates.date_of_birth = dto.dateOfBirth;
      if (dto.occupation !== undefined)
        holderUpdates.occupation = dto.occupation;
      if (dto.address !== undefined) holderUpdates.address = dto.address;

      if (Object.keys(holderUpdates).length > 1) {
        const { error: holderError } = await supabase
          .from('policyholder_details')
          .update(holderUpdates);

        if (holderError) {
          throw new SupabaseException(
            'Failed to update policyholder details',
            holderError,
          );
        }
      }
    }

    const updated = await this.getUserById(user_id);
    return new CommonResponseDto<UserResponseDto>({
      statusCode: 200,
      message: 'User updated successfully',
      data: updated.data,
    });
  }

  async getUserStats(): Promise<CommonResponseDto<UserStatsResponseDto>> {
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

    return new CommonResponseDto<UserStatsResponseDto>({
      statusCode: 200,
      message: 'User statistics retrieved successfully',
      data: new UserStatsResponseDto({
        totalUsers: totalUsers ?? 0,
        activeUsers: activeUsers ?? 0,
        policyholders: policyholders ?? 0,
        insuranceAdmins: admins ?? 0,
      }),
    });
  }
}
