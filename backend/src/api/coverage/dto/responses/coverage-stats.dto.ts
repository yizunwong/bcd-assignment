import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CoverageStatsDto {
  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Number of active coverage policies.',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  activeCoverage!: number;

  @ApiProperty({
    type: Number,
    example: 12345.67,
    description:
      'Total value of coverage across active policies (choose your unit: USD/ETH/etc).',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalCoverageValue!: number;

  @ApiProperty({
    type: Number,
    example: 42,
    description: 'Total number of claims filed.',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalClaims!: number;

  @ApiProperty({
    type: Number,
    example: 87.5,
    description: 'Approval rate as a percentage (0–100).',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  approvalRate!: number;
}
