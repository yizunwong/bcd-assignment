import { ApiProperty } from '@nestjs/swagger';

export class PolicyStatsDto {
  @ApiProperty()
  activePolicies!: number;

  @ApiProperty()
  deactivatedPolicies!: number;

  @ApiProperty()
  totalSales!: number;

  @ApiProperty()
  totalRevenue!: number;

  constructor(init?: Partial<PolicyStatsDto>) {
    Object.assign(this, init);
  }
}
