import { ApiProperty } from '@nestjs/swagger';

export class ClaimDocumentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  claim_id!: number;

  @ApiProperty({
    description: 'Signed Supabase URL for accessing this document',
    example:
      'https://qydplatgoxvtomjhkqrx.supabase.co/storage/v1/object/sign/...',
  })
  signedUrl!: string;
}

export class ClaimResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  submitted_date!: string;

  @ApiProperty()
  priority!: string;

  @ApiProperty({ type: [ClaimDocumentResponseDto] })
  claim_documents!: ClaimDocumentResponseDto[];
}
