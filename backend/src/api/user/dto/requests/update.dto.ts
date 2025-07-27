import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from 'src/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'active', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
