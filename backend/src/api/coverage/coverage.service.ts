import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
import { FindCoverageQueryDto } from './dto/responses/coverage-query.dto';
// import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CommonResponseDto } from 'src/common/common.dto';

@Injectable()
export class CoverageService {
  async create(dto: CreateCoverageDto, req: AuthenticatedRequest) {
    //Get user from request (from Bearer token)
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;

    //Insert into coverage table
    const { data: coverage, error: coverageError } = await req.supabase
      .from('coverage')
      .insert({
        policy_id: dto.policy_id,
        user_id: user_id,
        status: dto.status,
        utilization_rate: dto.utilization_rate,
        start_date: dto.start_date,
        end_date: dto.end_date,
        next_payment_date: dto.next_payment_date,
      })
      .select()
      .single();

    if (coverageError || !coverage) {
      console.error(coverageError);
      throw new InternalServerErrorException('Failed to create coverage');
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Coverage created successfully',
    });
  }

  async findAll(req: AuthenticatedRequest, query: FindCoverageQueryDto) {
    const supabase = req.supabase;
    const offset = ((query.page || 1) - 1) * (query.limit || 5);

    let dbQuery = supabase
      .from('coverage')
      .select(
        `
      *,
      policies!inner(
        name,
        description,
        category
      )
    `,
        { count: 'exact' },
      )
      .range(offset, offset + (query.limit || 5) - 1);

    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }
    if (query.category) {
      dbQuery = dbQuery.eq('policies.category', query.category);
    }
    if (query.search) {
      dbQuery = dbQuery.or(
        `policies.name.ilike.%${query.search}%,policies.description.ilike.%${query.search}%`,
      );
    }

    const sortableFields = ['id', 'start_date', 'utilization_rate'];
    const sortField =
      query.sortBy && sortableFields.includes(query.sortBy)
        ? query.sortBy
        : 'id';
    dbQuery = dbQuery.order(sortField, {
      ascending: (query.sortOrder || 'asc') === 'asc',
    });

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch coverage data');
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Coverage retrieved successfully',
      data: data,
      count: count || 0,
    });
  }

  async findOne(id: number, req: AuthenticatedRequest) {
    const { data: coverage, error: findOneError } = await req.supabase
      .from('coverage')
      .select('*')
      .eq('id', id)
      .single();

    if (findOneError || !coverage) {
      console.error(findOneError);
      throw new NotFoundException(`Coverage with ID ${id} not found`);
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Coverage retrieved successfully',
      data: coverage,
    });
  }

  async update(
    id: number,
    updateCoverageDto: UpdateCoverageDto,
    req: AuthenticatedRequest,
  ) {
    const { data: existingCoverage, error: fetchError } = await req.supabase
      .from('coverage')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingCoverage) {
      console.error(fetchError);
      throw new NotFoundException(`Coverage with ID ${id} not found`);
    }

    const updateFields: Partial<typeof existingCoverage> = {};

    if (updateCoverageDto.status !== undefined)
      updateFields.status = updateCoverageDto.status;
    if (updateCoverageDto.utilization_rate !== undefined)
      updateFields.utilization_rate = updateCoverageDto.utilization_rate;
    if (updateCoverageDto.start_date !== undefined)
      updateFields.start_date = updateCoverageDto.start_date;
    if (updateCoverageDto.end_date !== undefined)
      updateFields.end_date = updateCoverageDto.end_date;
    if (updateCoverageDto.next_payment_date !== undefined)
      updateFields.next_payment_date = updateCoverageDto.next_payment_date;

    const { data: updatedCoverage, error: updateError } = await req.supabase
      .from('coverage')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedCoverage) {
      console.error(updateError);
      throw new InternalServerErrorException('Failed to update coverage');
    }

    return {
      statusCode: 200,
      message: `Coverage with ID ${id} updated successfully`,
      data: updatedCoverage,
    };
  }

  async remove(id: number, req: AuthenticatedRequest) {
    const { data: existingCoverage, error: fetchError } = await req.supabase
      .from('coverage')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingCoverage) {
      console.error(fetchError);
      throw new NotFoundException(`Coverage with ID ${id} not found`);
    }

    const { error: deleteError } = await req.supabase
      .from('coverage')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      throw new InternalServerErrorException('Failed to delete coverage');
    }

    return {
      statusCode: 200,
      message: `Coverage with ID ${id} deleted successfully`,
    };
  }
}
