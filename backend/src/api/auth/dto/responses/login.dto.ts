import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: () => UserDto })
  user!: UserDto;

  constructor(dto: LoginResponseDto) {
    Object.assign(this, dto);
  }
}
