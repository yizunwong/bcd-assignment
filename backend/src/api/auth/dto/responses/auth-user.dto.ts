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

  constructor(dto: AuthUserResponseDto) {
    Object.assign(this, dto);
  }
}
