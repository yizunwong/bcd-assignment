import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'johndoe', description: 'Username for the user' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty()
  username!: string;
}
