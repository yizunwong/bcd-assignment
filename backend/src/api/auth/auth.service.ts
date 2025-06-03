import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RegisterDto } from './requests/register.dto';
import { LoginDto } from './requests/login.dto';
import { LoginResponseDto } from './responses/login.dto';

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

    return new LoginResponseDto({
      accessToken: data.session.access_token,
      user: data.user,
    });
  }

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          username: dto.username,
        },
      },
    });

    if (error) {
      throw new ConflictException(error.message);
    }

    return {
      message: 'User registered. Please check your email to confirm.',
      data,
    };
  }
}
