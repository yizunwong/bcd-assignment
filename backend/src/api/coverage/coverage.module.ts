import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ClaimModule } from '../claim/claim.module';

@Module({
  imports: [SupabaseModule, ClaimModule],
  controllers: [CoverageController],
  providers: [CoverageService],
})
export class CoverageModule {}
