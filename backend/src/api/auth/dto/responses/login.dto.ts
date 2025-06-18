import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;

  constructor(dto: LoginResponseDto) {
    Object.assign(this, dto);
  }
}
