import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CompanyDetailsDto } from 'src/api/auth/dto/requests/register.dto';
import { ToPhone } from 'src/common/to-phone';
import { UserRole } from 'src/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

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

  @ApiProperty({
    example: '0x1234567890abcdef1234567890abcdef12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  //Only for insurance_admin
  @ValidateIf((o: CreateUserDto) => o.role === UserRole.INSURANCE_ADMIN)
  @ApiProperty({ type: () => CompanyDetailsDto, required: false })
  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  company?: CompanyDetailsDto;

  //Only for policyholder
  @ValidateIf((o: CreateUserDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: '1985-06-15', required: false })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: string;

  @ValidateIf((o: CreateUserDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsNotEmpty()
  @IsString()
  occupation!: string;

  @ValidateIf((o: CreateUserDto) => o.role === UserRole.POLICYHOLDER)
  @ApiProperty({ example: '123 Main St', required: false })
  @IsNotEmpty()
  @IsString()
  address!: string;
}
