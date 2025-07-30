import { ConflictException, Injectable } from '@nestjs/common';
import { SupabaseException } from 'src/supabase/types/supabase.exception';
import { CreateUserDto } from './dto/requests/create.dto';
import { UpdateUserDto } from './dto/requests/update.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Database } from 'src/supabase/types/supabase.types';
import { parseAppMetadata } from 'src/utils/auth-metadata';
import { CommonResponseDto } from 'src/common/common.dto';
import { UserResponseDto } from './dto/respond/user.dto';
import { UserStatsResponseDto } from './dto/respond/user-stats.dto';
import {
  UserRole,
  UserStatus,
  AdminDetails,
  PolicyholderDetails,
} from 'src/enums';
import { CompanyDetailsDto } from '../auth/dto/requests/register.dto';

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
    const { data, error } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      app_metadata: { role: dto.role },
    });

    if (error || !data?.user) {
      throw new SupabaseException('Failed to create auth user', error);
    }

    return data;
  }

  async createUserProfile(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    user_id: string,
    dto: CreateUserDto,
  ) {
    const { bio, firstName, lastName } = dto;
    let status: UserStatus = UserStatus.ACTIVE;

    if (dto.role === UserRole.INSURANCE_ADMIN) {
      status = UserStatus.DEACTIVATED; // Pending admin verification
    }

    const { data, error } = await supabase
      .from('user_details')
      .insert([
        {
          user_id,
          status: status,
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

  async createRoleSpecificDetails(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    user_id: string,
    dto: CreateUserDto,
  ) {
    if (dto.role === UserRole.INSURANCE_ADMIN) {
      let company_id: number | null = null;

      if (dto.company) {
        // 🔍 Step 1: Check if company with same name exists
        const { data: existingCompany, error: checkError } = await supabase
          .from('companies')
          .select('id')
          .eq('name', dto.company.name)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw new ConflictException(
            'Failed to check existing company: ' + checkError.message,
          );
        }

        if (existingCompany?.id) {
          company_id = existingCompany.id;
        } else {
          // 🆕 Step 2: Insert new company (fill required defaults if any)
          const safeCompany = {
            name: dto.company.name,
            address: dto.company.address ?? '',
            license_number: dto.company.license_number ?? '',
            contact_no: dto.company.contact_no ?? '',
            website: dto.company.website ?? '',
            years_in_business: dto.company.years_in_business ?? '0-1 years',
          };

          const { data: insertedCompany, error: insertError } = await supabase
            .from('companies')
            .insert([safeCompany])
            .select('id')
            .single();

          if (insertError || !insertedCompany?.id) {
            throw new ConflictException(
              'Failed to insert company: ' + insertError?.message,
            );
          }

          company_id = insertedCompany.id;
        }
      }

      if (!company_id) {
        throw new ConflictException('Company could not be resolved.');
      }

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

    const { error: authError } = await supabase.auth.admin.updateUserById(
      user_id,
      {
        email: dto.email,
        password: dto.password,
        app_metadata: {
          role: dto.role,
        },
      },
    );

    if (authError) {
      throw new SupabaseException('Failed to update auth user', authError);
    }

    const { error: profileError } = await supabase
      .from('user_details')
      .update({
        status: dto.status,
        first_name: dto.firstName,
        last_name: dto.lastName,
        phone: dto.phone,
        bio: dto.bio,
      })
      .eq('user_id', user_id);

    if (profileError) {
      throw new SupabaseException(
        'Failed to update user profile',
        profileError,
      );
    }

    console.log('dto', dto);

    if (dto.role === UserRole.INSURANCE_ADMIN) {
      if (dto.company) {
        await this.updateOrInsertCompany(supabase, user_id, dto.company);
      }
    }

    if (dto.role === UserRole.POLICYHOLDER) {
      const { error: holderError } = await supabase
        .from('policyholder_details')
        .update({
          date_of_birth: dto.dateOfBirth,
          occupation: dto.occupation,
          address: dto.address,
        });

      if (holderError) {
        throw new SupabaseException(
          'Failed to update policyholder details',
          holderError,
        );
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

  private async updateOrInsertCompany(
    supabase: ReturnType<SupabaseService['createClientWithToken']>,
    user_id: string,
    company: CompanyDetailsDto,
  ): Promise<number> {
    if (!company) {
      throw new SupabaseException('Missing company data for admin');
    }

    console.log(company);

    // Check if admin already has a company
    const { data: existingAdmin, error: adminError } = await supabase
      .from('admin_details')
      .select('company_id')
      .eq('user_id', user_id)
      .single();

    if (adminError) {
      throw new SupabaseException('Failed to fetch admin details', adminError);
    }

    // Update existing company if one is already linked
    if (existingAdmin?.company_id) {
      const { error: updateCompanyError } = await supabase
        .from('companies')
        .update(company)
        .eq('id', existingAdmin.company_id);

      if (updateCompanyError) {
        throw new SupabaseException(
          'Failed to update company',
          updateCompanyError,
        );
      }

      return existingAdmin.company_id;
    }

    // Insert new company and return new ID
    const { data: inserted, error: insertError } = await supabase
      .from('companies')
      .insert([company])
      .select('id')
      .single();

    if (insertError || !inserted?.id) {
      throw new SupabaseException('Failed to insert new company', insertError);
    }

    // Also update admin_details to reference the new company
    const { error: updateAdminError } = await supabase
      .from('admin_details')
      .update({ company_id: inserted.id })
      .eq('user_id', user_id);

    if (updateAdminError) {
      throw new SupabaseException(
        'Failed to link new company to admin',
        updateAdminError,
      );
    }

    return inserted.id;
  }
}
