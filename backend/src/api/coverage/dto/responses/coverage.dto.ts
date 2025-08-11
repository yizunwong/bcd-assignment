import { ApiProperty } from '@nestjs/swagger';

export class CoveragePolicyDto {
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
  provider!: string;
}

export class CoverageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  policy_id!: number | null;

  @ApiProperty({ required: false })
  user_id!: string | null;

  @ApiProperty({ required: false })
  status!: string | null;

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
