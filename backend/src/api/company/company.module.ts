import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
