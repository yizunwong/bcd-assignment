import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PolicyModule } from '../policy/policy.module';

@Module({
  imports: [PolicyModule],
  controllers: [ClaimController],
  providers: [ClaimService, SupabaseService],
  exports: [ClaimService],
})
export class ClaimModule {}
