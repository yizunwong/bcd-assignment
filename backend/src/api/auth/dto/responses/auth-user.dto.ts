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
  firstName?: string | null;

  @ApiProperty({ required: false })
  lastName?: string | null;

  @ApiProperty({ required: false })
  phone?: string | null;

  @ApiProperty({ required: false })
  bio?: string | null;

  // Policyholder specific fields
  @ApiProperty({ required: false })
  address?: string | null;

  @ApiProperty({ required: false })
  dateOfBirth?: string | null;

  @ApiProperty({ required: false })
  occupation?: string | null;

  // Insurance admin specific fields
  @ApiProperty({ required: false })
  companyName?: string | null;

  @ApiProperty({ required: false })
  companyAddress?: string | null;

  @ApiProperty({ required: false })
  companyContactNo?: string | null;

  @ApiProperty({ required: false })
  companyLicenseNo?: string | null;

  constructor(dto: AuthUserResponseDto) {
    Object.assign(this, dto);
  }
}
