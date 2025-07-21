import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfClaimExtractorService } from './pdf-claim-extractor.service';
import { CommonResponseDto } from 'src/common/common.dto';
import { ExtractedClaimTypesDto } from './dto/extracted-claim-types.dto';

@Controller('claim-type-extractor')
export class PdfClaimExtractorController {
  constructor(private readonly service: PdfClaimExtractorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async extract(@UploadedFile() file: Express.Multer.File): Promise<CommonResponseDto<ExtractedClaimTypesDto>> {
    const data = await this.service.extractClaimTypes(file);
    return new CommonResponseDto({
      statusCode: 200,
      message: 'Extraction successful',
      data,
    });
  }
}
