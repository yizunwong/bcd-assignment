import { ApiProperty } from '@nestjs/swagger';
import {
  UserRole,
  AdminDetails,
  PolicyholderDetails,
  UserStatus,
} from 'src/enums';

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

  @ApiProperty({ required: false, nullable: true })
  walletAddress?: string | null;

  @ApiProperty({ example: 'active', enum: UserStatus })
  status!: UserStatus;

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
