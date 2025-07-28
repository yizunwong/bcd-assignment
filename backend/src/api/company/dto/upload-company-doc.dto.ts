import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UploadCompanyDocDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  company_id!: number;

  @ApiProperty({ example: 'license.pdf' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'company_documents/license.pdf' })
  @IsString()
  @IsNotEmpty()
  path!: string;
}
