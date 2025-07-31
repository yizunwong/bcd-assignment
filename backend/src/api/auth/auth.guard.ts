import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookies = request.cookies as Record<string, string | undefined>;
    let token = cookies?.access_token;
    const refreshToken = cookies?.refresh_token;
    const res = context.switchToHttp().getResponse();

    if (token) {
      request.supabase = this.supabaseService.createClientWithToken(token);
      const { data, error } = await request.supabase.auth.getUser();
      if (data?.user && !error) {
        request.user = data.user;
        return true;
      }
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Missing access token in cookie');
    }

    const supabase = this.supabaseService.createClientWithToken();
    const { data: refreshData, error: refreshError } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: token ?? '',
    });

    if (refreshError || !refreshData.session) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    token = refreshData.session.access_token;
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    res.cookie('access_token', refreshData.session.access_token, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refresh_token', refreshData.session.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: 'lax',
      path: '/',
    });

    request.supabase = this.supabaseService.createClientWithToken(token);
    const { data } = await request.supabase.auth.getUser();
    request.user = data.user;

    return true;
  }
}
