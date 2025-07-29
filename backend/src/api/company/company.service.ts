import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { FileService } from '../file/file.service';
import { CommonResponseDto } from 'src/common/common.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly fileService: FileService) {}

  async addDocuments(
    companyId: number,
    files: Array<Express.Multer.File>,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const paths = await this.fileService.uploadFiles(
      req.supabase,
      files,
      'company_documents',
      companyId.toString(10),
    );

    const inserts = files.map((file, idx) => ({
      company_id: companyId,
      name: file.originalname,
      path: paths[idx],
    }));

    const { error } = await req.supabase
      .from('company_documents')
      .insert(inserts);

    if (error) {
      throw new InternalServerErrorException('Failed to create documents');
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Documents uploaded successfully',
    });
  }
}
