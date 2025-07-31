// src/claims/dto/find-claims-query.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryDto } from 'src/common/paginated-query.dto';

export class FindClaimsQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Filter by claim type (category)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Search keyword for claim_type or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    default: 'id',
    enum: ['id', 'type', 'amount', 'status', 'submitted_date'],
  })
  @IsOptional()
  @IsIn(['id', 'type', 'amount', 'status', 'submitted_date'])
  sortBy: string = 'id';

  @ApiPropertyOptional({ default: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
