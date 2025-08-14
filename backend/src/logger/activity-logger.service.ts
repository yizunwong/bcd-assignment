import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ActivityLoggerService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async log(action: string, userId: string, ip?: string): Promise<void> {
    const supabase = this.supabaseService.createClientWithToken();
    await supabase.from('activity_logs').insert({
      action,
      user_id: userId,
      ip: ip,
      timestamp: new Date().toISOString(),
    });
  }
}
