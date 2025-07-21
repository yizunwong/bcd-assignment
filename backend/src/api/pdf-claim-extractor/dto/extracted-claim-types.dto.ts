import { ApiProperty } from '@nestjs/swagger';

export class ClaimTypeBenefitDto {
  @ApiProperty()
  type!: string;

  @ApiProperty()
  maxBenefit!: string;
}

export class ExtractedClaimTypesDto {
  @ApiProperty()
  policyType!: string;

  @ApiProperty({ type: () => [ClaimTypeBenefitDto] })
  claimTypes!: ClaimTypeBenefitDto[];
}
