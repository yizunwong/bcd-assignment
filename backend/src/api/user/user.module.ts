import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UserService } from './user.service';

@Module({
  imports: [SupabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
