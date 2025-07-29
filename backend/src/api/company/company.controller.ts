import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CompanyService } from './company.service';
import { CommonResponseDto } from 'src/common/common.dto';
import { UploadDocDto } from '../file/requests/document-upload.dto';
import { CompanyDetailsDto } from './dto/create-company.dto';

@Controller('company')
@ApiBearerAuth('supabase-auth')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() dto: CompanyDetailsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CommonResponseDto> {
    return this.service.createCompany(dto, files);
  }

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  // @UseGuards(AuthGuard)
  upload(
    @Param('id') id: string,
    @Body() dto: UploadDocDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.service.addDocuments(+id, files);
  }
}
