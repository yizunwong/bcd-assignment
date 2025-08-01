// src/policies/dto/find-policies-query.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryDto } from 'src/common/paginated-query.dto';

export class FindPoliciesQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Filter by policy category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Search keyword for name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    default: 'id',
    enum: ['id', 'name', 'rating', 'premium', 'popularity'],
  })
  @IsOptional()
  @IsIn(['id', 'name', 'rating', 'premium', 'popularity'])
  sortBy: string = 'id';

  @ApiPropertyOptional({ default: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({ description: 'Filter by creator user id' })
  @IsOptional()
  @IsString()
  userId?: string;
}
