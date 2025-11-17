import { ApiProperty } from '@nestjs/swagger';

export class CoverageClaimDto {
  @ApiProperty({ description: 'Primary key' })
  id!: number;

  @ApiProperty({ description: 'Associated policy ID' })
  policyId!: number;

  @ApiProperty({ description: 'Claim type name' })
  name!: string;

  @ApiProperty({ description: 'Created timestamp', type: String })
  createdAt!: string; // or Date if you convert it
}

export class CoveragePolicyDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description!: string | null;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  coverage!: number;

  @ApiProperty()
  premium!: number;

  @ApiProperty()
  duration_days!: number;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  status!: string;
  @ApiProperty({
    type: [CoverageClaimDto],
    description: 'List of claims for this coverage',
  })
  claims?: CoverageClaimDto[];
}

export class CoverageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  policyId!: number;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  agreementCid!: string;

  @ApiProperty()
  utilizationRate!: number;

  @ApiProperty()
  startDate!: string;

  @ApiProperty()
  endDate!: string;

  @ApiProperty()
  nextPaymentDate!: string;

  @ApiProperty({ type: () => CoveragePolicyDto })
  policies?: CoveragePolicyDto;

  constructor(partial: Partial<CoverageResponseDto>) {
    Object.assign(this, partial);
  }
}
