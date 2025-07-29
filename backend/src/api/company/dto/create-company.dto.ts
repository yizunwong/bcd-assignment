import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { YearsInBusiness, NumberOfEmployees } from 'src/enums';

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
