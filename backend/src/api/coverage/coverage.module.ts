import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';
import { CoverageController } from './coverage.controller';

@Module({
  controllers: [CoverageController],
  providers: [CoverageService],
})
export class CoverageModule {}
