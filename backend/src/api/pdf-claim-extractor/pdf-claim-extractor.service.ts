import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import { ExtractedClaimTypesDto, ClaimTypeBenefitDto } from './dto/extracted-claim-types.dto';

@Injectable()
export class PdfClaimExtractorService {
  async extractClaimTypes(file: Express.Multer.File): Promise<ExtractedClaimTypesDto> {
    const data = await pdfParse(file.buffer);
    const text = data.text || '';
    return this.parseText(text);
  }

  private parseText(text: string): ExtractedClaimTypesDto {
    let policyType = 'UNKNOWN';
    const policyMatch = text.match(/Policy\s*Type\s*[:\-]?\s*(\w+)/i);
    if (policyMatch) {
      policyType = policyMatch[1].toUpperCase();
    }

    const claimTypes: ClaimTypeBenefitDto[] = [];
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^(Trip Cancellation|Trip Delay|Baggage Delay|Lost Luggage|Medical(?: \w+)?|[A-Z][A-Za-z ]+)\s*[-–:]?\s*(.+)$/i);
      if (match) {
        claimTypes.push({ type: match[1].trim(), maxBenefit: match[2].trim() });
      }
    }

    return { policyType, claimTypes };
  }
}
