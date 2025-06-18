import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
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

  constructor(dto: UserResponseDto) {
    Object.assign(this, dto);
  }
}
