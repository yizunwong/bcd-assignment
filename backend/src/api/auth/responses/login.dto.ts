import { ApiProperty } from '@nestjs/swagger';
import { User } from '@supabase/supabase-js';

export class LoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  user!: User;

  constructor(dto: LoginResponseDto) {
    Object.assign(this, dto);
  }
}
