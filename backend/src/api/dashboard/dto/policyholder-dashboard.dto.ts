import { ApiProperty } from '@nestjs/swagger';

export class PolicyDetailsDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  coverage!: number;

  constructor(init?: Partial<PolicyDetailsDto>) {
    Object.assign(this, init);
  }
}

export class ActiveCoverageDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  policy_id!: number;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  utilization_rate!: number;

  @ApiProperty()
  start_date!: string;

  @ApiProperty()
  end_date!: string;

  @ApiProperty()
  next_payment_date!: string;

  @ApiProperty({ type: PolicyDetailsDto, nullable: true })
  policy!: PolicyDetailsDto | null;

  constructor(init?: Partial<ActiveCoverageDto>) {
    Object.assign(this, init);
  }
}

export class PolicyholderDashboardDto {
  @ApiProperty()
  activeCoverage!: number;

  @ApiProperty()
  totalCoverage!: number;

  @ApiProperty()
  pendingClaims!: number;

  @ApiProperty({ type: [ActiveCoverageDto] })
  activeCoverageObject!: ActiveCoverageDto[];

  constructor(init?: Partial<PolicyholderDashboardDto>) {
    Object.assign(this, init);
  }
}
