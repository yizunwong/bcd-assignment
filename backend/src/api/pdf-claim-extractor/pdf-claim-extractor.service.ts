import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import {
  ExtractedClaimTypesDto,
  ClaimTypeBenefitDto,
} from './dto/extracted-claim-types.dto';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { CommonResponseDto } from 'src/common/common.dto';

@Injectable()
export class PdfClaimExtractorService {
  private gemini: GoogleGenerativeAI;

  constructor() {
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  async extractClaimTypes(
    file: Express.Multer.File,
  ): Promise<CommonResponseDto<ExtractedClaimTypesDto>> {
    const data = await pdfParse(file.buffer);
    const text = data.text || '';

    const extracted = await this.extractWithGemini(text);

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Extraction successful',
      data: extracted,
    });
  }
  private async extractWithGemini(
    text: string,
  ): Promise<ExtractedClaimTypesDto> {
    try {
      const model: GenerativeModel = this.gemini.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent([
        {
          text: `
Extract only the first table from the following insurance policy text. 
The table has two columns: "Benefits per Insured" and "Benefit Maximums".
Return the data as a JSON array of objects with "type" and "maxBenefit" properties.

Policy text:
${text}

Only return the JSON data, no additional explanations or text.
          `,
        },
      ]);

      const response = result.response;
      const content: string = response.text();
      console.log(
        'Gemini response:',
        ' Input tokens:' + result.response.usageMetadata?.promptTokenCount,
        ' Output tokens:' + result.response.usageMetadata?.candidatesTokenCount,
        ' Total tokens:' + result.response.usageMetadata?.totalTokenCount,
      );

      const jsonText: string = this.extractJsonBlock(content);

      const parsed = JSON.parse(jsonText) as unknown;
      if (!Array.isArray(parsed)) {
        throw new Error('Expected an array of claim type objects.');
      }

      const claimTypes: ClaimTypeBenefitDto[] = parsed as ClaimTypeBenefitDto[];

      return {
        policyType: 'Allianz Comprehensive Coverage',
        claimTypes,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error extracting with Gemini:', error.message);
      } else {
        console.error('Unknown error extracting with Gemini:', error);
      }

      return {
        policyType: 'Unknown',
        claimTypes: [],
      };
    }
  }

  private extractJsonBlock(text: string): string {
    const match =
      text.match(/```json\s*([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  }
}
