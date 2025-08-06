import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReviewRespondDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  id!: number;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({ example: 'Great policy!', required: false })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
