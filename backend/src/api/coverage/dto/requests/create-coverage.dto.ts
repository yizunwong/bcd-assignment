import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  IsString,
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
    description: 'ID of the coverage',
  })
  @IsInt({ message: 'id must be an integer' })
  @IsNotEmpty({ message: 'id is required' })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the policy this coverage is linked to',
  })
  @IsInt({ message: 'policy_id must be an integer' })
  @IsNotEmpty({ message: 'policy_id is required' })
  policyId!: number;

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
  utilizationRate!: number;

  @ApiProperty({
    example: '2025-07-01',
    description: 'Start date of the coverage (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'start_date must be a valid date string' })
  @IsNotEmpty({ message: 'start_date is required' })
  startDate!: string;

  @ApiProperty({
    example: '2026-07-01',
    description: 'End date of the coverage (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'end_date must be a valid date string' })
  @IsNotEmpty({ message: 'end_date is required' })
  endDate!: string;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Next payment date for the coverage (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    { message: 'next_payment_date must be a valid date string' },
  )
  @IsNotEmpty({ message: 'next_payment_date is required' })
  nextPaymentDate!: string;

  @ApiProperty({
    example: 'QmHash',
    description: 'CID of the signed agreement stored on IPFS',
  })
  @IsString({ message: 'agreement_cid must be a string' })
  @IsNotEmpty({ message: 'agreement_cid is required' })
  agreementCid!: string;

  @ApiProperty({
    example: 'Policy Name',
    description:
      'Name of the policy (optional - will be fetched from database)',
    required: false,
  })
  @IsString({ message: 'policy_name must be a string' })
  policyName!: string;
}
