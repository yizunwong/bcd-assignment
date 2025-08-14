import { Global, Module } from '@nestjs/common';
import { ActivityLoggerService } from './activity-logger.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Global()
@Module({
  imports: [SupabaseModule],
  providers: [ActivityLoggerService],
  exports: [ActivityLoggerService],
})
export class LoggerModule {}
