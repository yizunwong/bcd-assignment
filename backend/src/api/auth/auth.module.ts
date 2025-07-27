import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  imports: [SupabaseModule, UserModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
