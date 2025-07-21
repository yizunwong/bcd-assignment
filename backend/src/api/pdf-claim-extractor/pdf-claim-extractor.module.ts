import { Module } from '@nestjs/common';
import { PdfClaimExtractorController } from './pdf-claim-extractor.controller';
import { PdfClaimExtractorService } from './pdf-claim-extractor.service';

@Module({
  controllers: [PdfClaimExtractorController],
  providers: [PdfClaimExtractorService],
})
export class PdfClaimExtractorModule {}
