import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { UserService } from './user.service';
import { LoggerModule } from 'src/logger/logger.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SupabaseModule, LoggerModule, FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
