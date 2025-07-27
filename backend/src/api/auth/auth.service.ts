import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { LoginResponseDto } from './dto/responses/login.dto';
import { CommonResponseDto } from '../../common/common.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthUserResponseDto } from './dto/responses/auth-user.dto';
import { parseAppMetadata, parseUserMetadata } from 'src/utils/auth-metadata';
import { Response } from 'express';
import { UserRole, UserStatus } from 'src/enums';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signInWithEmail(body: LoginDto, res: Response) {
    // ✅ Anonymous client, no token needed for login
    const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.session) {
      console.log(error);
      throw new UnauthorizedException('Invalid email or password');
    }

    res.cookie('access_token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'lax',
      path: '/',
    });

    const metadata = parseUserMetadata(data.user.user_metadata);
    const appMeta = parseAppMetadata(data.user.app_metadata);

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Login successful',
      data: new LoginResponseDto({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          email_verified: metadata.email_verified ?? false,
          username: metadata.username ?? '',
          role: appMeta.role ?? '',
          lastSignInAt: data.user.last_sign_in_at ?? '',
          provider: appMeta.provider ?? '',
        },
      }),
    });
  }

  async register(dto: RegisterDto) {
    try {
      const supabase = this.supabaseService.createClientWithToken();

      // 1. Create Supabase Auth User
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email: dto.email,
        password: dto.password,
      });

      if (signUpError || !auth?.user) {
        throw new ConflictException(
          signUpError?.message || 'Failed to register user',
        );
      }

      const user_id = auth.user.id;
      let status: UserStatus = UserStatus.ACTIVE;

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user_id,
        {
          app_metadata: {
            role: dto.role,
          },
        },
      );

      if (dto.role === UserRole.INSURANCE_ADMIN) {
        status = UserStatus.DEACTIVATED; // Pending admin verification
      }

      // 2. Insert into user_details
      const { error: profileError } = await supabase
        .from('user_details')
        .insert([
          {
            user_id,
            first_name: dto.firstName,
            last_name: dto.lastName,
            status,
            bio: dto.bio ?? null,
            phone: dto.phone ?? null,
          },
        ]);

      if (profileError || updateError) {
        throw new ConflictException(
          'Failed to insert user profile: ' + profileError?.message,
        );
      }

      // 3. Role-specific data handling
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

        // Step 3: Insert into admin_details
        const { error: adminError } = await supabase
          .from('admin_details')
          .insert([
            {
              user_id,
              company_id,
              verified_at: null,
            },
          ]);

        if (adminError) {
          throw new ConflictException(
            'Failed to insert admin details: ' + adminError.message,
          );
        }
      }

      if (dto.role === UserRole.POLICYHOLDER) {
        const { error: holderError } = await supabase
          .from('policyholder_details')
          .insert([
            {
              user_id,
              date_of_birth: dto.dateOfBirth ?? '',
              occupation: dto.occupation ?? '',
              address: dto.address ?? '',
            },
          ]);

        if (holderError) {
          throw new ConflictException(
            'Failed to insert policyholder details: ' + holderError.message,
          );
        }
      }

      return new CommonResponseDto({
        statusCode: 201,
        message: 'Registration successful',
      });
    } catch (e) {
      return new CommonResponseDto({
        statusCode: 400,
        message:
          'Registration failed: ' +
          (e instanceof ConflictException ? e.message : 'Unknown error'),
      });
    }
  }

  async getMe(req: AuthenticatedRequest) {
    const { data, error } = await req.supabase.auth.getUser();

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const metadata = parseUserMetadata(data.user.user_metadata);
    const appMeta = parseAppMetadata(data.user.app_metadata);

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Authenticated User retrieved successfully',
      data: new AuthUserResponseDto({
        id: data.user.id,
        email: data.user.email ?? '',
        email_verified: metadata.email_verified ?? false,
        username: metadata.username ?? '',
        role: appMeta.role ?? '',
        lastSignInAt: data.user.last_sign_in_at ?? '',
        provider: appMeta.provider ?? '',
      }),
    });
  }

  async signOut(req: AuthenticatedRequest, res: Response) {
    const { error } = await req.supabase.auth.signOut();

    // Clear the access_token cookie
    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    if (error) {
      throw new UnauthorizedException('Failed to sign out: ' + error.message);
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Logout successful',
    });
  }
}
