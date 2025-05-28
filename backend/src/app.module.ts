import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [AuthModule, SupabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
