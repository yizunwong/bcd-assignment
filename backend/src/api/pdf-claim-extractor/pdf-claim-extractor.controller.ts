import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfClaimExtractorService } from './pdf-claim-extractor.service';
import { CommonResponseDto } from 'src/common/common.dto';
import {
  ExtractClaimDto,
  ExtractedClaimTypesDto,
} from './dto/extracted-claim-types.dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('claim-type-extractor')
export class PdfClaimExtractorController {
  constructor(private readonly service: PdfClaimExtractorService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async extract(
    @Body() body: ExtractClaimDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommonResponseDto<ExtractedClaimTypesDto>> {
    const data = await this.service.extractClaimTypes(file);
    console.log('Extracted data:', data);
    return new CommonResponseDto({
      statusCode: 200,
      message: 'Extraction successful',
      data,
    });
  }
}
