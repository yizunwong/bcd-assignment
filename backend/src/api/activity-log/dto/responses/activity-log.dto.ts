import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  action!: string;

  @ApiProperty({ required: false, nullable: true })
  user_id!: string | null;

  @ApiProperty({ required: false, nullable: true })
  ip!: string | null;

  @ApiProperty({ required: false, nullable: true })
  timestamp!: string | null;

  constructor(partial: Partial<ActivityLogDto>) {
    Object.assign(this, partial);
  }
}
