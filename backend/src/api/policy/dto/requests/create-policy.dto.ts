import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  Max,
  Min,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentsDto {
  @ApiProperty({ example: 'Policy Terms', description: 'Document name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'https://example.com/policy-terms.pdf',
    description: 'Document URL',
  })
  @IsString()
  @IsNotEmpty()
  url!: string;

  constructor(dto: CreateDocumentsDto) {
    Object.assign(this, dto);
  }
}

export class CreateReviewsDto {
  @ApiProperty({
    example: '4f2a3343-1234-4b2d-9e13-8bbf0e2f748b',
    description: 'User ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty({ example: 5, description: 'Rating between 1 and 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({
    example: 'Excellent coverage and service.',
    required: false,
    description: 'Optional user comment',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  constructor(dto: CreateReviewsDto) {
    Object.assign(this, dto);
  }
}

export class CreatePolicyDto {
  @ApiProperty({ example: 'Comprehensive Health Coverage' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'health' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'HealthSecure' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  coverage!: number;

  @ApiProperty({ example: '0.8 ETH/month' })
  @IsString()
  @IsNotEmpty()
  premium!: string;

  @ApiProperty({ example: 4.8 })
  @IsNumber()
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  popular!: boolean;

  @ApiProperty({
    example: ['Emergency Care', 'Prescription Drugs', 'Mental Health'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  features!: string[];

  @ApiProperty({
    example:
      'Complete healthcare coverage with blockchain-verified claims processing',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDocumentsDto)
  @ApiProperty({ type: CreateDocumentsDto, isArray: true })
  documents!: CreateDocumentsDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateReviewsDto)
  @ApiProperty({ type: CreateReviewsDto, isArray: true, required: false })
  @IsOptional()
  reviews?: CreateReviewsDto[];

  constructor(dto: CreatePolicyDto) {
    Object.assign(this, dto);
  }
}
