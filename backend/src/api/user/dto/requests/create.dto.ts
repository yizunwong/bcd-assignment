import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'alex.johnson@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: 'policyholder',
    enum: ['policyholder', 'insurance_admin'],
  })
  @IsIn(['policyholder', 'insurance_admin'])
  @IsNotEmpty()
  role!: 'policyholder' | 'insurance_admin';

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'verified', required: false })
  @IsOptional()
  @IsString()
  kyc_status?: string;

  @ApiProperty({ example: 'New York, USA', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  login_attempts?: number;

  @ApiProperty({ example: 'Test user', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Farm Corp Ltd', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  policies?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  claims?: number;
}
