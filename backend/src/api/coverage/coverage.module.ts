import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ClaimModule } from '../claim/claim.module';
import { PinataModule } from 'src/pinata/pinata.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SupabaseModule, ClaimModule, PinataModule, NotificationsModule],
  controllers: [CoverageController],
  providers: [CoverageService],
})
export class CoverageModule {}
