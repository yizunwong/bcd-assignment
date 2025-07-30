import { ApiProperty } from '@nestjs/swagger';

export class PolicyDocumentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  policy_id!: number;

  @ApiProperty({
    description: 'Signed Supabase URL for accessing this document',
  })
  signedUrl!: string;
}

export class PolicyResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  coverage!: number;

  @ApiProperty()
  duration_days!: number;

  @ApiProperty()
  premium!: number;

  @ApiProperty()
  rating!: number;

  @ApiProperty()
  popular!: boolean;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty()
  claim_types!: string[];

  @ApiProperty()
  sales!: number;

  @ApiProperty({ type: [PolicyDocumentResponseDto] })
  policy_documents!: PolicyDocumentResponseDto[];
}
