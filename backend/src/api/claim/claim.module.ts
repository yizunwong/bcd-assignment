import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [ClaimController],
  providers: [ClaimService, SupabaseService],
  exports: [ClaimService],
})
export class ClaimModule {}
