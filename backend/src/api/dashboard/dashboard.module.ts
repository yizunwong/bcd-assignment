import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [SupabaseModule],
})
export class DashboardModule {}
