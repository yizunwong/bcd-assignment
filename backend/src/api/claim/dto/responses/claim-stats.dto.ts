import { ApiProperty } from '@nestjs/swagger';

export class ClaimStatsDto {
  @ApiProperty()
  pending!: number;

  @ApiProperty()
  claimed!: number;

  @ApiProperty()
  approved!: number;

  @ApiProperty()
  rejected!: number;

  constructor(dto: Partial<ClaimStatsDto>) {
    Object.assign(this, dto);
  }
}
