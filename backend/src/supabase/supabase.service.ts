// supabase-request.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

@Injectable()
export class SupabaseService {
  private supabaseUrl = process.env.SUPABASE_URL!;
  private anonKey = process.env.SUPABASE_ANON_KEY!;

  createClientWithToken(token?: string) {
    if (token) {
      return createClient<Database>(this.supabaseUrl, this.anonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }

    // Fallback: anonymous client
    return createClient<Database>(this.supabaseUrl, this.anonKey);
  }
}
