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

export class PolicyHolderDetailsDto {
  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  date_of_birth!: string;

  @ApiProperty()
  occupation!: string;

  @ApiProperty()
  address!: string;
}

export class PolicySummaryDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  coverage!: number;

  @ApiProperty()
  premium!: number;
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

  @ApiProperty()
  submitted_by!: string;

  @ApiProperty({ type: [ClaimDocumentResponseDto] })
  claim_documents!: ClaimDocumentResponseDto[];

  @ApiProperty({ type: PolicyHolderDetailsDto })
  policyholder_details!: PolicyHolderDetailsDto;

  @ApiProperty({ type: PolicySummaryDto })
  policy!: PolicySummaryDto;
}
