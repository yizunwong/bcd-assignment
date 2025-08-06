import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  email_verified!: boolean;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  lastSignInAt!: string;

  @ApiProperty()
  provider!: string;

  // General profile fields
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ example: 'active' })
  status?: string;

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

  constructor(dto: AuthUserResponseDto) {
    Object.assign(this, dto);
  }
}
