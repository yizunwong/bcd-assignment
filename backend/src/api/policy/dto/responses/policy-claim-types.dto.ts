import { ApiProperty } from '@nestjs/swagger';

export class PolicyClaimTypesDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [String] })
  claim_types!: string[];
}
