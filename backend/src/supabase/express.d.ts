// src/common/types/authenticated-request.ts
import { Request } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/supabase/supabase.types';

export interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  userId: string;
}
