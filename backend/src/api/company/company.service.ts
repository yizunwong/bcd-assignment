import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { CommonResponseDto } from 'src/common/common.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly fileService: FileService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async addDocuments(
    companyId: number,
    files: Array<Express.Multer.File>,
  ): Promise<CommonResponseDto> {
    const supabase = this.supabaseService.createClientWithToken();
    const paths = await this.fileService.uploadFiles(
      supabase,
      files,
      'company_documents',
      companyId.toString(10),
    );

    const inserts = files.map((file, idx) => ({
      company_id: companyId,
      name: file.originalname,
      path: paths[idx],
    }));

    const { error } = await supabase.from('company_documents').insert(inserts);

    if (error) {
      throw new InternalServerErrorException('Failed to create documents');
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Documents uploaded successfully',
    });
  }
}
