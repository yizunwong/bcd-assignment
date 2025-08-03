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

export class AdminDashoboardDto {
  @ApiProperty()
  activePolicies!: number;

  @ApiProperty()
  pendingClaims!: number;

  @ApiProperty()
  activeUsers!: number;

  @ApiProperty()
  totalRevenue!: number;

  @ApiProperty({ type: [TopPolicyDto] })
  topPolicies!: TopPolicyDto[];

  constructor(init?: Partial<AdminDashoboardDto>) {
    Object.assign(this, init);
  }
}
