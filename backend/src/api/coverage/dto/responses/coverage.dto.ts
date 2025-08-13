import { ApiProperty } from '@nestjs/swagger';

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
}

export class CoverageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  policy_id!: number;

  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  agreement_cid!: string;

  @ApiProperty()
  utilization_rate!: number;

  @ApiProperty()
  start_date!: string;

  @ApiProperty()
  end_date!: string;

  @ApiProperty()
  next_payment_date!: string;

  @ApiProperty({ type: () => CoveragePolicyDto })
  policies?: CoveragePolicyDto;
}
