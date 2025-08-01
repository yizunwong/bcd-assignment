import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UploadPolicyDocDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the policy to attach the document to',
  })
  @IsInt({ message: 'Policy ID must be an integer' })
  @IsNotEmpty({ message: 'Policy ID is required' })
  policy_id!: number;

  @ApiProperty({
    example: 'terms.pdf',
    description: 'Name of the uploaded document',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'policy_documents/xyz.pdf',
    description: 'Path of the uploaded file in Supabase storage',
  })
  @IsString()
  @IsNotEmpty()
  path!: string;
}
