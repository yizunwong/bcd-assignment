// supabase-request.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase.types';

@Injectable()
export class SupabaseService {
  getClient() {
    throw new Error('Method not implemented.');
  }
  private supabaseUrl = process.env.SUPABASE_URL!;
  private serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  createClientWithToken(token?: string) {
    if (token) {
      return createClient<Database>(this.supabaseUrl, this.serviceRoleKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }

    // Fallback: anonymous client
    return createClient<Database>(this.supabaseUrl, this.serviceRoleKey);
  }
}
