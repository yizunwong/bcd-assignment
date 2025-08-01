import { ApiProperty } from '@nestjs/swagger';

export class PolicyCategoryCountStatsDto {
  @ApiProperty()
  travel!: number;

  @ApiProperty()
  health!: number;

  @ApiProperty()
  crop!: number;
}
