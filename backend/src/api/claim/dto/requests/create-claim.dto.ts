import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateClaimDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the policy associated with the claim',
  })
  @IsNotEmpty({ message: 'Policy ID is required' })
  policy_id!: number;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'User ID (UUID) of the claimant',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  user_id!: string;

  @ApiProperty({
    example: 'accident',
    description: 'Type of the claim',
  })
  @IsString({ message: 'Claim type must be a string' })
  @IsNotEmpty({ message: 'Claim type is required' })
  claim_type!: string;

  @ApiProperty({
    example: 1000.0,
    description: 'Amount claimed',
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount!: number;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the claim',
  })
  @IsString({ message: 'Status must be a string' })
  @IsNotEmpty({ message: 'Status is required' })
  status!: string;

  @ApiProperty({
    example: '2025-07-06',
    description: 'Date when the claim was submitted',
  })
  @IsDateString({}, { message: 'Submitted date must be a valid date string' })
  @IsNotEmpty({ message: 'Submitted date is required' })
  submitted_date!: string;

  @ApiProperty({
    example: '2025-07-07',
    description: 'Date when the claim was processed',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Processed date must be a valid date string' })
  processed_date?: string;

  @ApiProperty({
    example: '2025-07-08',
    description: 'Date when the claim was claimed',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Claimed date must be a valid date string' })
  claimed_date?: string;

  @ApiProperty({
    example: 'Accident on highway, car damaged.',
    description: 'Description of the claim',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
