import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { UserRole } from 'src/api/user/dto/requests/create.dto';
import { ToPhone } from 'src/common/to-phone';

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
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Johnson', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'policyholder', enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: '+1234567890', required: false })
  @ToPhone
  @IsString({ message: 'must be a valid phone number' })
  phone?: string;

  @ApiProperty({ example: 'I am a policyholder', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  //Admin-only details
  @ValidateIf((o: RegisterDto) => o.role === UserRole.INSURANCE_ADMIN)
  @IsNotEmpty({ message: 'Employee ID is required for admins' })
  @IsString()
  @ApiProperty({ example: 'EMP123456', required: false })
  employeeId?: string;

  @ValidateIf((o: RegisterDto) => o.role === UserRole.INSURANCE_ADMIN)
  @IsNotEmpty({ message: 'License number is required for admins' })
  @IsString()
  @ApiProperty({ example: 'LIC789456', required: false })
  licenseNumber?: string;

  @ApiProperty({ example: 'ABC Company', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'New York, USA', required: false })
  @IsOptional()
  @IsString()
  companyAddress?: string;

  //Policyholder-only details
  @ValidateIf((o: RegisterDto) => o.role === UserRole.POLICYHOLDER)
  @IsNotEmpty({ message: 'Date of birth is required for policyholders' })
  @ApiProperty({ example: '1990-06-15', required: false })
  dateOfBirth?: string;

  @ApiProperty({ example: 'Engineer', required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
