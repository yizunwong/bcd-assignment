import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateClaimDto } from './create-claim.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @ApiProperty({
    example: 1,
    description: 'ID of the claim to update',
    required: true,
  })
  @IsInt({ message: 'Claim ID must be an integer' })
  @IsNotEmpty({ message: 'Claim ID is required' })
  id!: number;
}
