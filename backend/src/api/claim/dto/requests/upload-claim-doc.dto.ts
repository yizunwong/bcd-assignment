import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UploadClaimDocDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the claim to which the document belongs',
  })
  @IsInt({ message: 'Claim ID must be an integer' })
  @IsNotEmpty({ message: 'Claim ID is required' })
  claim_id!: number;

  @ApiProperty({
    example: 'accident_report.pdf',
    description: 'Name of the uploaded document',
  })
  @IsString({ message: 'Document name must be a string' })
  @IsNotEmpty({ message: 'Document name is required' })
  name!: string;

  @ApiProperty({
    example: 'claim_documents/abc123.pdf',
    description: 'Path of the uploaded file in Supabase storage',
  })
  @IsString({ message: 'Path must be a string' })
  @IsNotEmpty({ message: 'Path is required' })
  path!: string;
}
