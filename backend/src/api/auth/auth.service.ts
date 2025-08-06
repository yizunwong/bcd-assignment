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
import { parseAppMetadata, parseUserMetadata } from 'src/utils/auth-metadata';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums';
import { ProfileResponseDto } from './dto/responses/profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userService: UserService,
  ) {}

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

    // ✅ Get role from app_metadata
    const appMeta = parseAppMetadata(data.user.app_metadata);
    const metadata = parseUserMetadata(data.user.user_metadata);

    // 🔒 Only check verified_at if role is insurance_admin
    if (appMeta.role === UserRole.INSURANCE_ADMIN) {
      const { data: adminDetails } = await supabase
        .from('admin_details')
        .select('verified_at')
        .eq('user_id', data.user.id)
        .single();

      if (!adminDetails || !adminDetails.verified_at) {
        throw new UnauthorizedException('User is not verified');
      }
    }
    res.cookie('access_token', data.session.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    if (body.rememberMe) {
      res.cookie('refresh_token', data.session.refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/',
      });
    }

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
        options: {
          data: {
            verified_at: null,
          },
        },
      });

      if (signUpError || !auth?.user) {
        throw new ConflictException(
          signUpError?.message || 'Failed to register user',
        );
      }

      const user_id = auth.user.id;

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user_id,
        {
          app_metadata: {
            role: dto.role,
          },
        },
      );

      if (updateError) {
        throw new ConflictException(
          'Failed to update user role: ' + updateError.message,
        );
      }

      await this.userService.createUserProfile(supabase, user_id, dto);
      const roleDetails = await this.userService.createRoleSpecificDetails(
        supabase,
        user_id,
        dto,
      );

      const companyId =
        roleDetails && 'company_id' in roleDetails
          ? roleDetails.company_id
          : null;

      return new CommonResponseDto({
        statusCode: 201,
        message: 'Registration successful',
        data: companyId ? { companyId } : undefined,
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
    const appMeta = parseAppMetadata(req.user.app_metadata);

    const { data: profile } = await req.supabase
      .from('user_details')
      .select(
        `first_name, last_name, phone, bio, status,
        policyholder_details(address, date_of_birth, occupation),
        admin_details(company:companies(name, address, contact_no, license_number))`,
      )
      .eq('user_id', req.user.id)
      .single();

    const dto = new ProfileResponseDto({
      id: req.user.id,
      role: appMeta.role!,
      firstName: profile?.first_name ?? '',
      lastName: profile?.last_name ?? '',
      email: req.user.email ?? '',
      phone: profile?.phone ?? '',
      bio: profile?.bio ?? '',
      status: profile?.status ?? '',
    });

    if (appMeta.role === UserRole.POLICYHOLDER) {
      dto.address = profile?.policyholder_details?.address ?? '';
      dto.dateOfBirth = profile?.policyholder_details?.date_of_birth ?? '';
      dto.occupation = profile?.policyholder_details?.occupation ?? '';
    }

    if (appMeta.role === UserRole.INSURANCE_ADMIN) {
      dto.companyName = profile?.admin_details?.company?.name ?? '';
      dto.companyAddress = profile?.admin_details?.company?.address ?? '';
      dto.companyContactNo = profile?.admin_details?.company?.contact_no ?? '';
      dto.companyLicenseNo =
        profile?.admin_details?.company?.license_number ?? '';
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Authenticated User retrieved successfully',
      data: dto,
    });
  }

  async signOut(req: AuthenticatedRequest, res: Response) {
    const { error } = await req.supabase.auth.signOut();

    // Clear the auth cookies
    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
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
