import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReviewRespondDto } from 'src/api/reviews/dto/repsonses/review.dto';
import { PolicyCategory } from 'src/enums';

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
  @IsEnum(PolicyCategory)
  category!: PolicyCategory;

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
  policy_documents?: PolicyDocumentResponseDto[];

  @ApiProperty({ type: [ReviewRespondDto] })
  reviews?: ReviewRespondDto[];
}
