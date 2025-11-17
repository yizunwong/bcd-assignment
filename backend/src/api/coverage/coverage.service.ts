import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PinataService } from 'src/pinata/pinata.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
import { FindCoverageQueryDto } from './dto/responses/coverage-query.dto';
import { CoverageResponseDto } from './dto/responses/coverage.dto';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CommonResponseDto } from 'src/common/common.dto';
import { CoverageStatsDto } from './dto/responses/coverage-stats.dto';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
@Injectable()
export class CoverageService {
  constructor(
    private readonly pinataService: PinataService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async uploadAgreement(file: Express.Multer.File, req: AuthenticatedRequest) {
    const cid = await this.pinataService.uploadPolicyDocument(file, {
      userId: req.user.id,
    });
    return new CommonResponseDto({
      statusCode: 201,
      message: 'Agreement uploaded successfully',
      data: cid,
    });
  }

  async create(dto: CreateCoverageDto, req: AuthenticatedRequest) {
    // Insert into coverage table
    const { data: coverage, error: coverageError } = await req.supabase
      .from('coverage')
      .upsert(
        {
          id: dto.id,
          policy_id: dto.policy_id,
          user_id: req.user.id,
          status: dto.status,
          utilization_rate: dto.utilization_rate,
          start_date: dto.start_date,
          end_date: dto.end_date,
          next_payment_date: dto.next_payment_date,
          agreement_cid: dto.agreement_cid,
        },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (coverageError || !coverage) {
      console.error(coverageError);
      throw new InternalServerErrorException('Failed to create coverage');
    }

    // Create notification for successful coverage creation
    try {
      await this.notificationsService.createSystemNotification(
        req.user.id,
        'Coverage Created Successfully',
        `Your coverage for policy "${dto.policy_name}" has been created successfully. You can now file claims under this coverage.`,
        'success',
      );
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't throw error here as coverage was created successfully
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Coverage created successfully',
      data: new CoverageResponseDto({
        id: coverage.id,
        policyId: coverage.policy_id,
        userId: coverage.user_id,
        status: coverage.status,
        utilizationRate: coverage.utilization_rate,
        startDate: coverage.start_date,
        endDate: coverage.end_date,
        nextPaymentDate: coverage.next_payment_date,
        agreementCid: coverage.agreement_cid,
      }),
    });
  }

  async findAll(
    req: AuthenticatedRequest,
    query: FindCoverageQueryDto,
  ): Promise<CommonResponseDto<CoverageResponseDto[]>> {
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
        category,
        coverage,
        premium,
        status,
        admin_details:admin_details!policies_created_by_fkey1(
          company:companies(name)
        )
      )
    `,
        { count: 'exact' },
      )
      .range(offset, offset + (query.limit || 5) - 1)
      .eq('user_id', req.user.id);

    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }
    if (query.category) {
      dbQuery = dbQuery.eq('policies.category', query.category);
    }
    if (query.search) {
      const searchTerm = `*${query.search}*`;
      dbQuery = dbQuery.or(
        `name.ilike.${searchTerm},description.ilike.${searchTerm}`,
        { referencedTable: 'policies' },
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

    const enriched = data.map((c: any) => ({
      ...c,
      policies: c.policies
        ? {
            ...c.policies,
            provider: c.policies.admin_details?.company?.name || '',
          }
        : c.policies,
    }));

    return new CommonResponseDto<CoverageResponseDto[]>({
      statusCode: 200,
      message: 'Coverage retrieved successfully',
      data: enriched,
      count: count || 0,
    });
  }

  async findOne(
    id: number,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<CoverageResponseDto>> {
    const { data: coverage, error: findOneError } = await req.supabase
      .from('coverage')
      .select(
        `
      *,
      policies!inner(
        id,
        name,
        description,
        category,
        coverage,
        premium,
        status,
        duration_days,
        admin_details:admin_details!policies_created_by_fkey1(
          company:companies(name)
        )
        
      )
    `,
      )
      .eq('id', id)
      .single();

    if (findOneError || !coverage) {
      console.error(findOneError);
      throw new NotFoundException(`Coverage with ID ${id} not found`);
    }

    const { data: claimsData, error: claimsError } = await req.supabase
      .from('claims')
      .select(
        `
    id,
    policy_id,
    created_at,
    claim_types!claims_claim_type_id_fkey(name)
  `,
      )
      .eq('policy_id', coverage.policies.id);

    if (claimsError) {
      console.error(claimsError);
      throw new InternalServerErrorException('Failed to fetch claims data');
    }
    return new CommonResponseDto({
      statusCode: 200,
      message: 'Coverage retrieved successfully',
      data: {
        id: coverage.id,
        policyId: coverage.policies.id,
        userId: coverage.user_id,
        status: coverage.status,
        utilizationRate: coverage.utilization_rate,
        agreementCid: coverage.agreement_cid,
        startDate: coverage.start_date,
        endDate: coverage.end_date,
        nextPaymentDate: coverage.next_payment_date,
        policies: coverage.policies
          ? {
              ...coverage.policies,
              provider: coverage.policies.admin_details?.company?.name || '',
            }
          : coverage.policies,
        claims: claimsData || [],
      },
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

    const { data: updatedCoverage, error: updateError } = await req.supabase
      .from('coverage')
      .update(updateCoverageDto)
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

  async getCoverageStats(req: AuthenticatedRequest) {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userId = userData.user.id;
    // 1. Fetch active coverages and joined policy info
    const { data: coverages, error: coverageError } = await req.supabase
      .from('coverage')
      .select(
        `
      id,
      policy_id,
      policy:policy_id (
        id,
        name,
        premium
      )
    `,
      )
      .eq('user_id', userId)
      .eq('status', 'active');

    if (coverageError) {
      throw new InternalServerErrorException('Failed to fetch coverages');
    }

    const activeCoverage = coverages.length;

    // 2. Sum approved claims for active policies only (SQL-side filter)
    const { data: approvedClaims, error: approvedClaimsError } =
      await req.supabase
        .from('claims')
        .select('amount')
        .eq('submitted_by', userId)
        .eq('status', 'approved')
        .in(
          'coverage_id',
          coverages.map((c) => c.id),
        );

    if (approvedClaimsError) {
      console.error(approvedClaimsError);
      throw new InternalServerErrorException('Failed to fetch approved claims');
    }

    const totalCoverageValue = approvedClaims.reduce(
      (sum, claim) => sum + (claim.amount || 0),
      0,
    );

    // 3. Get all claims to calculate total and approval rate
    const { data: claims, error: claimsError } = await req.supabase
      .from('claims')
      .select('status')
      .eq('submitted_by', userId);

    if (claimsError) {
      throw new InternalServerErrorException('Failed to fetch claims');
    }

    const totalClaims = claims.length;
    const approvedClaimsCount = claims.filter(
      (c) => c.status === 'approved',
    ).length;
    const approvalRate =
      totalClaims > 0 ? (approvedClaimsCount / totalClaims) * 100 : 0;

    return new CommonResponseDto<CoverageStatsDto>({
      statusCode: 200,
      message: 'Coverage stats fetched successfully',
      data: {
        activeCoverage,
        totalCoverageValue,
        approvalRate,
        totalClaims,
      },
    });
  }
}
