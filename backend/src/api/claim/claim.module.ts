import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FileModule } from '../file/file.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [FileModule, NotificationsModule],
  controllers: [ClaimController],
  providers: [ClaimService, SupabaseService],
  exports: [ClaimService],
})
export class ClaimModule {}
