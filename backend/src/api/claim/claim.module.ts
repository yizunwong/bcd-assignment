import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FileModule } from '../file/file.module';
import { ClaimBlockchainListenerService } from './claim-blockchain-listener.service';

@Module({
  imports: [FileModule],
  controllers: [ClaimController],
  providers: [ClaimService, SupabaseService, ClaimBlockchainListenerService],
  exports: [ClaimService],
})
export class ClaimModule {}
