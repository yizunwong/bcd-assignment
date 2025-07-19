import { ApiProperty } from '@nestjs/swagger';
import { CoverageStatus } from '../../requests/create-coverage.dto';

export class CoveragePolicyDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description!: string | null;

  @ApiProperty()
  category!: string;
}

export class CoverageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  policy_id!: number | null;

  @ApiProperty({ required: false })
  user_id!: string | null;

  @ApiProperty({ enum: CoverageStatus })
  status!: CoverageStatus;

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
