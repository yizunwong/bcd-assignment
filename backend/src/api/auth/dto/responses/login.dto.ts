import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponseDto } from './auth-user.dto';

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: () => AuthUserResponseDto })
  user!: AuthUserResponseDto;

  constructor(dto: LoginResponseDto) {
    Object.assign(this, dto);
  }
}
