import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsUUID,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export enum CoverageStatus {
  ACTIVE = 'active',
  LIMIT_EXCEEDED = 'limitExceeded',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

export class CreateCoverageDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the policy this coverage is linked to',
  })
  @IsInt({ message: 'policy_id must be an integer' })
  @IsNotEmpty({ message: 'policy_id is required' })
  policy_id!: number;

  @ApiProperty({
    example: 'a3e1f2b4-1234-4c56-8e7d-123456789abc',
    description: 'UUID of the user who owns this coverage',
  })
  @IsUUID('4', { message: 'user_id must be a valid UUID' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id!: string;

  @ApiProperty({
    example: 'active',
    description: 'Status of the coverage',
  })
  @IsEnum(CoverageStatus)
  @IsNotEmpty({ message: 'status is required' })
  status!: CoverageStatus;

  @ApiProperty({
    example: 0,
    description: 'Utilization rate of the coverage',
  })
  @IsNumber({}, { message: 'utilization_rate must be a number' })
  @IsNotEmpty({ message: 'utilization_rate is required' })
  utilization_rate!: number;

  @ApiProperty({
    example: '2025-07-01',
    description: 'Start date of the coverage (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'start_date must be a valid date string' })
  @IsNotEmpty({ message: 'start_date is required' })
  start_date!: string;

  @ApiProperty({
    example: '2026-07-01',
    description: 'End date of the coverage (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'end_date must be a valid date string' })
  @IsNotEmpty({ message: 'end_date is required' })
  end_date!: string;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Next payment date for the coverage (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    { message: 'next_payment_date must be a valid date string' },
  )
  @IsNotEmpty({ message: 'next_payment_date is required' })
  next_payment_date!: string;
}
