import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
// import { LoanModule } from './api/loan/loan.module';
import { ClaimModule } from './api/claim/claim.module';

@Module({
  imports: [AuthModule, SupabaseModule, UserModule, ClaimModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
