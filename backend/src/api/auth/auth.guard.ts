import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const res = context.switchToHttp().getResponse<Response>();
    const cookies = request.cookies as Record<string, string | undefined>;
    const token = cookies?.access_token;
    const refreshToken = cookies?.refresh_token;

    // Step 1: Try to use access token
    if (token) {
      const supabase = this.supabaseService.createClientWithToken(token);
      const { data, error } = await supabase.auth.getUser();

      if (data?.user && !error) {
        request.supabase = supabase;
        request.user = data.user;
        return true;
      }
    }

    // Step 2: If token is expired or invalid, try refresh
    if (token && refreshToken) {
      const supabase = this.supabaseService.createClientWithToken();
      const { data: refreshData, error: refreshError } =
        await supabase.auth.setSession({
          refresh_token: refreshToken,
          access_token: token,
        });

      if (refreshError || !refreshData.session) {
        throw new UnauthorizedException(
          'Session expired, please log in again.',
        );
      }

      // Set new tokens in cookies
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      res.cookie('access_token', refreshData.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge,
      });
      res.cookie('refresh_token', refreshData.session.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge,
      });

      const refreshed = this.supabaseService.createClientWithToken(
        refreshData.session.access_token,
      );
      const { data } = await refreshed.auth.getUser();
      if (!data?.user) {
        throw new UnauthorizedException('User not found after refresh.');
      }

      request.supabase = refreshed;
      request.user = data.user;
      return true;
    }

    throw new UnauthorizedException('Authentication required.');
  }
}
