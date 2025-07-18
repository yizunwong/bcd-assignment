import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CoverageStatus,
  CreateCoverageDto,
} from './dto/requests/create-coverage.dto';
// import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';

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

    return {
      statusCode: 201,
      message: 'Coverage created successfully',
      data: coverage,
    };
  }

  async findAll(
    req: AuthenticatedRequest,
    page = 1,
    limit = 5,
    category?: string,
    search?: string,
    status?: CoverageStatus,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const supabase = req.supabase;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('coverage')
      .select(
        `
      *,
      policies (
        name,
        description,
        category
      )
    `,
        { count: 'exact' },
      )
      .range(offset, offset + limit - 1);

    // Remove this block, since it causes the error:
    // if (category) {
    //   query = query.eq('category', category);
    // }

    if (status) {
      query = query.eq('status', status);
    }

    const sortableFields = ['start_date', 'utilization_rate'];
    if (sortableFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    const { data, error: findAllError, count } = await query;

    if (findAllError) {
      console.error(findAllError);
      throw new InternalServerErrorException('Failed to fetch coverage data');
    }

    // Filter in JS if category or search is provided
    let filteredData = data;
    if (category) {
      filteredData = filteredData.filter(
        (item) => item.policies && item.policies.category === category,
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.policies &&
          ((item.policies.name &&
            item.policies.name.toLowerCase().includes(searchLower)) ||
            (item.policies.description &&
              item.policies.description.toLowerCase().includes(searchLower))),
      );
    }

    return {
      statusCode: 200,
      message: 'Coverage data retrieved successfully',
      metadata: {
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
        pageSize: limit,
      },
      data: filteredData,
    };
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

    return {
      statusCode: 200,
      message: 'Coverage data retrieved successfully',
      data: coverage,
    };
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
