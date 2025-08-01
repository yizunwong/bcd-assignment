// src/policies/dto/find-policies-query.dto.ts
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryDto } from 'src/common/paginated-query.dto';
import { PolicyCategory } from 'src/enums';

export class FindPoliciesQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by policy category',
    enum: PolicyCategory,
  })
  @IsOptional()
  @IsEnum(PolicyCategory)
  category?: PolicyCategory;

  @ApiPropertyOptional({
    description: 'Search keyword for name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    default: 'id',
    enum: ['id', 'name', 'rating', 'premium', 'sales'],
  })
  @IsOptional()
  @IsIn(['id', 'name', 'rating', 'premium', 'sales'])
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
