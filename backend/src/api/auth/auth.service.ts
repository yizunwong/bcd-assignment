import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthenticatedRequest } from 'src/supabase/express';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { LoginResponseDto } from './dto/responses/login.dto';
import { CommonResponseDto } from '../../common/common.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signInWithEmail(body: LoginDto) {
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Login successful',
      data: new LoginResponseDto({
        accessToken: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
          email_verified: data.user.user_metadata?.email_verified as boolean,
          username: data.user.user_metadata?.username as string,
          role: data.user.user_metadata?.role as string,
          lastSignInAt: data.user.last_sign_in_at as string,
          provider: data.user.app_metadata?.provider as string,
        },
      }),
    });
  }

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.createClientWithToken();

    const { error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          username: dto.username,
          role: 'tester',
        },
      },
    });

    if (error) {
      throw new ConflictException(error.message);
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Registration successful',
    });
  }

  async getMe(req: AuthenticatedRequest) {
    const { data, error } = await req.supabase.auth.getUser();

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user;
  }
}
