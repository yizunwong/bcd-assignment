import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { RegisterDto } from './requests/register.dto';
import { SignInDto } from './requests/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signInWithEmail(body: SignInDto) {
    // ✅ Anonymous client, no token needed for login
    const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: data.session.access_token,
      user: data.user,
    };
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
