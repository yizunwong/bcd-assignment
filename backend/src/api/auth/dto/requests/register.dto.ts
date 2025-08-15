import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
  IsUrl,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ToPhone } from 'src/common/to-phone';
import { NumberOfEmployees, UserRole, YearsInBusiness } from 'src/enums';

export class CompanyDetailsDto {
  @ApiProperty({ example: 'ABC Company', required: false })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '123 Main St, New York, USA', required: false })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ example: '+1 555-1234', required: false })
  @IsOptional()
  @IsString()
  contact_no?: string;

  @ApiProperty({ example: 'www.abccompany.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'LIC-00012345', required: false })
  @IsNotEmpty()
  @IsString()
  license_number!: string;

  @ApiProperty({
    example: YearsInBusiness.ZERO_TO_ONE,
    enum: YearsInBusiness,
  })
  @IsNotEmpty()
  @IsEnum(YearsInBusiness)
  years_in_business!: YearsInBusiness;

  @ApiProperty({
    example: NumberOfEmployees.ZERO_TO_TEN,
    enum: NumberOfEmployees,
  })
  @IsNotEmpty()
  @IsEnum(NumberOfEmployees)
  employees_number!: NumberOfEmployees;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsString()
  created_at?: string;
}

export class RegisterDto {
  // 🔐 Credentials
  @ApiProperty({
    example: 'alex.johnson@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password (must include upper, lower, digit)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message: 'Password must include uppercase, lowercase, and a number',
  })
  password!: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Confirm password (must match password)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message: 'Confirm password must include uppercase, lowercase, and a number',
  })
  confirmPassword!: string;

  // 👤 Personal Info
  @ApiProperty({ example: 'Alex', required: false })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Johnson', required: false })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'policyholder', enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: '+60123456789', required: false })
  @ToPhone
  @IsString({ message: 'must be a valid phone number' })
  phone?: string;

  @ApiProperty({ example: 'I am a policyholder', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    example: '0x1234567890abcdef1234567890abcdef12345678',
    description: 'Connected wallet address',
  })
  @IsNotEmpty()
  @IsString()
  walletAddress!: string;

  //Admin-only details
  @ValidateIf((o: RegisterDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ type: () => CompanyDetailsDto, required: false })
  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  company?: CompanyDetailsDto;

  //Policyholder-only details
  @ValidateIf((o: RegisterDto) => o.role === UserRole.POLICYHOLDER)
  @IsNotEmpty({ message: 'Date of birth is required for policyholders' })
  @ApiProperty({ example: '1990-06-15', required: false })
  dateOfBirth!: string;

  @ValidateIf((o: RegisterDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsNotEmpty()
  @IsString()
  occupation!: string;

  @ValidateIf((o: RegisterDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: '123 Main St', required: false })
  @IsNotEmpty()
  @IsString()
  address!: string;
}
