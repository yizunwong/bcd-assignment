import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonResponseDto<T = any> {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  data?: T;

  constructor(partial: Partial<CommonResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
