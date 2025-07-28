import { Controller, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CompanyService } from './company.service';
import { CommonResponseDto } from 'src/common/common.dto';

@Controller('company')
@ApiBearerAuth('supabase-auth')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents'))
  @UseGuards(AuthGuard)
  upload(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.service.addDocuments(+id, files, req);
  }
}
