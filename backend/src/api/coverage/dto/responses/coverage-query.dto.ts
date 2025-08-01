import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginatedQueryDto } from 'src/common/paginated-query.dto';
import { CoverageStatus } from '../requests/create-coverage.dto';
import { PolicyCategory } from 'src/enums';

export class FindCoverageQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by policy category',
    enum: PolicyCategory,
  })
  @IsOptional()
  @IsEnum(PolicyCategory)
  category?: PolicyCategory;

  @ApiPropertyOptional({
    description: 'Search keyword for policy name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CoverageStatus })
  @IsOptional()
  @IsEnum(CoverageStatus)
  status?: CoverageStatus;

  @ApiPropertyOptional({
    default: 'id',
    enum: ['id', 'start_date', 'utilization_rate'],
  })
  @IsOptional()
  @IsIn(['id', 'start_date', 'utilization_rate'])
  sortBy: string = 'id';

  @ApiPropertyOptional({ default: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
