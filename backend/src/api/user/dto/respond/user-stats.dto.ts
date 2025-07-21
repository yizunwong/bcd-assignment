import { ApiProperty } from '@nestjs/swagger';

export class UserStatsResponseDto {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  activeUsers!: number;

  @ApiProperty()
  policyholders!: number;

  @ApiProperty()
  insuranceAdmins!: number;

  constructor(dto: Partial<UserStatsResponseDto>) {
    Object.assign(this, dto);
  }
}
