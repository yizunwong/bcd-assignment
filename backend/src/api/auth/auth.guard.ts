import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { SupabaseService } from 'src/supabase/supabase.service';
import { parseAppMetadata } from 'src/utils/auth-metadata';
import { UserRole } from 'src/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const cookies = request.cookies as Record<string, string | undefined>;
    const token = cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Missing access token in cookie');
    }

    request.supabase = this.supabaseService.createClientWithToken(token);
    const { data, error } = await request.supabase.auth.getUser();

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = data.user;

    // ✅ Get role from app_metadata
    const appMeta = parseAppMetadata(data.user.app_metadata);

    // 🔒 Only check verified_at if role is insurance_admin
    if (appMeta.role === UserRole.INSURANCE_ADMIN) {
      const { data: adminDetails } = await request.supabase
        .from('admin_details')
        .select('verified_at')
        .eq('user_id', data.user.id)
        .single();

      if (!adminDetails || !adminDetails.verified_at) {
        throw new UnauthorizedException('User is not verified');
      }
    }

    return true;
  }
}
