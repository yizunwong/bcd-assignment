import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum ClaimPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class CreateClaimDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the policy associated with the claim',
  })
  @IsNotEmpty({ message: 'Policy ID is required' })
  policy_id!: number;

  @ApiProperty({
    example: 'accident',
    description: 'Type of the claim',
  })
  @IsString({ message: 'Claim type must be a string' })
  @IsNotEmpty({ message: 'Claim type is required' })
  claim_type!: string;

  @ApiProperty({
    example: ClaimPriority.MEDIUM,
    enum: ClaimPriority,
    description: 'Priority of the claim',
  })
  @IsNotEmpty({ message: 'Priority is required' })
  @IsEnum(ClaimPriority)
  priority!: ClaimPriority;

  @ApiProperty({
    example: 1000,
    description: 'Amount claimed',
  })
  // @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount!: number;

  @ApiProperty({
    example: 'Accident on highway, car damaged.',
    description: 'Description of the claim',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

}
