import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ToPhone } from 'src/common/to-phone';
import { Database } from 'src/supabase/types/supabase.types';

export enum UserStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

export enum UserRole {
  POLICYHOLDER = 'policyholder',
  INSURANCE_ADMIN = 'insurance_admin',
  SYSTEM_ADMIN = 'system_admin',
}

export type AdminDetails = Partial<
  Database['public']['Tables']['admin_details']['Row']
> | null;

export type PolicyholderDetails = Partial<
  Database['public']['Tables']['policyholder_details']['Row']
> | null;

export type UserDetails = Database['public']['Tables']['user_details']['Row'];

export class CreateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'alex.johnson@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'policyholder', enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: '1234567890', required: false })
  @ToPhone
  @IsString({ message: 'must be a valid phone number' })
  phone?: string;

  @ApiProperty({ example: 'I am a policyholder', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  //Only for insurance_admin
  @ValidateIf((o: CreateUserDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ example: 'EMP123456', required: false })
  @IsNotEmpty()
  @IsString()
  employeeId!: string;

  @ValidateIf((o: CreateUserDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ example: 'LIC789456', required: false })
  @IsNotEmpty()
  @IsString()
  licenseNumber!: string;

  @ValidateIf((o: CreateUserDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ example: 'ABC Company', required: false })
  @IsNotEmpty()
  @IsString()
  companyName!: string;

  @ValidateIf((o: CreateUserDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ example: 'New York, USA', required: false })
  @IsNotEmpty()
  @IsString()
  companyAddress!: string;

  //Only for policyholder
  @ValidateIf((o: CreateUserDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: '1985-06-15', required: false })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
