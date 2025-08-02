import { ApiProperty } from '@nestjs/swagger';

export class TopPolicyDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  sales!: number;

  constructor(init?: Partial<TopPolicyDto>) {
    Object.assign(this, init);
  }
}

export class DashboardSummaryDto {
  @ApiProperty()
  activePolicies!: number;

  @ApiProperty()
  pendingClaims!: number;

  @ApiProperty({ type: [TopPolicyDto] })
  topPolicies!: TopPolicyDto[];

  constructor(init?: Partial<DashboardSummaryDto>) {
    Object.assign(this, init);
  }
}
