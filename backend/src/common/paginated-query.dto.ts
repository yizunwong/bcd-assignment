import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginatedQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, type: Number })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 5, minimum: 1, type: Number })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  limit: number = 5;
}
