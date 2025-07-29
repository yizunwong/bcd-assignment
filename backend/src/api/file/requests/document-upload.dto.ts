import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UploadDocDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
    description: 'Files to upload for the document',
  })
  @IsOptional()
  @IsArray()
  files?: Express.Multer.File[];
}
