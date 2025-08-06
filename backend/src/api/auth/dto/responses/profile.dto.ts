import { ApiProperty } from '@nestjs/swagger';
import { NumberOfEmployees, UserRole, YearsInBusiness } from 'src/enums';

export class ProfileResponseDto {
  // General profile fields
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  bio!: string;

  @ApiProperty()
  status!: string;

  // Policyholder specific fields
  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  occupation?: string;

  // Insurance admin specific fields
  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  companyAddress?: string;

  @ApiProperty({ required: false })
  companyContactNo?: string;

  @ApiProperty({ required: false })
  companyLicenseNo?: string;

  @ApiProperty({ required: false, enum: YearsInBusiness })
  companyYearsInBusiness?: YearsInBusiness;

  @ApiProperty({ required: false, enum: NumberOfEmployees })
  companyEmployeesNumber?: NumberOfEmployees;

  constructor(dto: ProfileResponseDto) {
    Object.assign(this, dto);
  }
}
