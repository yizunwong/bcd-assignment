import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

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

export class ExtractClaimDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
    description: 'Documents to upload',
  })
  @IsOptional()
  @IsArray()
  file?: Express.Multer.File[];
}
