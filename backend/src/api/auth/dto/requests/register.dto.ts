import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { ToPhone } from 'src/common/to-phone';
import { UserRole } from 'src/enums';

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

  @ApiProperty({ example: '+60123456789', required: false })
  @ToPhone
  @IsString({ message: 'must be a valid phone number' })
  phone?: string;

  @ApiProperty({ example: 'I am a policyholder', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

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
