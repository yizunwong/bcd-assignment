import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  ip!: string;

  @ApiProperty()
  timestamp!: string;

  constructor(partial: Partial<ActivityLogDto>) {
    Object.assign(this, partial);
  }
}
