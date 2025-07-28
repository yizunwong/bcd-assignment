import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { FileModule } from '../file/file.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [FileModule, SupabaseModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
