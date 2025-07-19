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
import { Transform, Type } from 'class-transformer';
import { Express } from 'express';

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
  @Transform(({ value }: { value: unknown }) => parseInt(value as string, 10))
  @IsNumber()
  @IsNotEmpty()
  coverage!: number;

  @ApiProperty({ example: '0.8 ETH/month' })
  @IsString()
  @IsNotEmpty()
  premium!: string;

  @ApiProperty({ example: 0 })
  @Transform(({ value }: { value: unknown }) => parseInt(value as string, 10))
  @IsNumber()
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({ example: false })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsNotEmpty()
  popular!: boolean;

  @ApiProperty({
    example: ['Emergency Care', 'Prescription Drugs', 'Mental Health'],
  })
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return [];
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

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as CreateDocumentsDto[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return value as CreateDocumentsDto[];
  })
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentsDto)
  @IsOptional()
  documentMetas?: CreateDocumentsDto[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
    description: 'Files to upload for the policy',
  })
  @IsOptional()
  @IsArray()
  files?: Express.Multer.File[];

  constructor(dto: CreatePolicyDto) {
    Object.assign(this, dto);
  }
}
