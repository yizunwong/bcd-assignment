import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ClaimModule } from '../claim/claim.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SupabaseModule, ClaimModule, FileModule],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}
