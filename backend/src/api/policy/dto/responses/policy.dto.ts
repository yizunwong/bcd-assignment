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
  premium!: string;

  @ApiProperty()
  rating!: number;

  @ApiProperty()
  popular!: boolean;

  @ApiProperty({ required: false })
  description!: string | null;

  @ApiProperty({ type: [String] })
  features!: string[];

  @ApiProperty({ type: [PolicyDocumentResponseDto] })
  policy_documents!: PolicyDocumentResponseDto[];
}
