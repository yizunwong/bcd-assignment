import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
