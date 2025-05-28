// supabase-request.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

@Injectable()
export class SupabaseService {
  private supabaseUrl = process.env.SUPABASE_URL!;
  private anonKey = process.env.SUPABASE_ANON_KEY!;
  getServiceRoleClient(): SupabaseClient<Database> {
    return createClient<Database>(
      this.supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⛔ Never expose this to frontend
    );
  }

  getClient(req?: Request): SupabaseClient<Database> {
    if (!req) {
      return createClient<Database>(this.supabaseUrl, this.anonKey);
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Missing token');
    }

    return createClient<Database>(this.supabaseUrl, this.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }
}
