import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, SupabaseAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
