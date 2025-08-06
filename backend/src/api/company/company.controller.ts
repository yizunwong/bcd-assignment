import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CommonResponseDto } from 'src/common/common.dto';
import { UploadDocDto } from '../file/requests/document-upload.dto';

@Controller('company')
@ApiBearerAuth('supabase-auth')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  upload(
    @Param('id') id: string,
    @Body() dto: UploadDocDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CommonResponseDto> {
    return this.service.addDocuments(+id, files);
  }
}
