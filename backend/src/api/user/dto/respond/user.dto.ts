import { ApiProperty } from '@nestjs/swagger';
import {
  AdminDetails,
  PolicyholderDetails,
  UserRole,
} from '../requests/create.dto';

export class UserResponseDto {
  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ required: false, nullable: true })
  phone!: string | null;

  @ApiProperty({ required: false, nullable: true })
  bio!: string | null;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ required: false })
  lastLogin!: string | null | undefined;

  @ApiProperty({ required: false })
  joinedAt!: string | null | undefined;

  @ApiProperty({ required: false })
  details?: AdminDetails | PolicyholderDetails | null;

  constructor(dto: Partial<UserResponseDto>) {
    Object.assign(this, dto);
  }
}
