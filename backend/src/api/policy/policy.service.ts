import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { FileService } from '../file/file.service';
import { PinataService } from 'src/pinata/pinata.service';
import { CommonResponseDto } from 'src/common/common.dto';
import { PolicyResponseDto } from './dto/responses/policy.dto';
import { FindPoliciesQueryDto } from './dto/responses/policy-query.dto';
import { ClaimService } from '../claim/claim.service';
import { ActivityLoggerService } from 'src/logger/activity-logger.service';
import { PolicyCategoryCountStatsDto } from './dto/responses/policy-category.dto';
import { PolicyStatsDto } from './dto/responses/policy-stats.dto';
import { PolicyClaimTypesDto } from './dto/responses/policy-claim-types.dto';
import { PolicyCategory, PolicyStatus } from 'src/enums';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
@Injectable()
export class PolicyService {
  constructor(
    private readonly claimsService: ClaimService,
    private readonly fileService: FileService,
    private readonly supabaseService: SupabaseService,
    private readonly pinataService: PinataService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}
  async addPolicyDocuments(
    id: number,
    files: Array<Express.Multer.File>,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const hashes = await Promise.all(
      files.map((file) => this.pinataService.uploadPolicyDocument(file)),
    );

    const inserts = files.map((file, idx) => ({
      policy_id: id,
      name: file.originalname,
      path: `ipfs://${hashes[idx]}`,
      cid: hashes[idx],
    }));

    const { error } = await req.supabase
      .from('policy_documents')
      .insert(inserts);

    if (error) {
      throw new InternalServerErrorException(
        'Failed to create policy documents',
      );
    }
    const fileNames = files.map((f) => f.originalname).join(', ');

    await this.activityLogger.log(
      `Uploaded Policy Documents: ${fileNames}`,
      userData.user.id,
      req.ip,
    );
    return new CommonResponseDto({
      statusCode: 201,
      message: 'Policy Documents uploaded successfully',
    });
  }

  async create(dto: CreatePolicyDto, req: AuthenticatedRequest) {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    try {
      // Step 1: Insert policy
      const { data: policy, error: policyError } = await req.supabase
        .from('policies')
        .insert({
          name: dto.name,
          category: dto.category,
          coverage: dto.coverage,
          duration_days: dto.durationDays,
          premium: dto.premium,
          rating: dto.rating,
          popular: false,
          description: dto.description || null,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (policyError || !policy) {
        console.error(policyError);
        throw new InternalServerErrorException('Failed to create policy');
      }

      const policyId = policy.id;

      // Step 2: Attach claim types (optional)
      if (dto.claimTypes?.length) {
        await this.claimsService.attachClaimTypesToPolicy(
          dto.claimTypes,
          policyId,
          req,
        );
      }
      await this.activityLogger.log(
        `Created Policy: ${dto.name}`,
        userData.user.id,
        req.ip,
      );

      return new CommonResponseDto({
        statusCode: 201,
        message: 'Policy created successfully',
        data: policy,
      });
    } catch (error) {
      return new CommonResponseDto({
        statusCode: 500,
        message: error instanceof Error ? error.message : '',
      });
    }
  }

  async findAll(
    req: AuthenticatedRequest,
    query: FindPoliciesQueryDto,
  ): Promise<CommonResponseDto<PolicyResponseDto[]>> {
    const supabase = this.supabaseService.createClientWithToken();

    const sortableFields = ['id', 'name', 'rating', 'premium', 'popular'];
    if (query.sortBy && !sortableFields.includes(query.sortBy)) {
      throw new BadRequestException(`Invalid sortBy field: ${query.sortBy}`);
    }

    const offset = ((query.page || 1) - 1) * (query.limit || 5);

    let dbQuery = supabase
      .from('policies')
      .select(
        `*,
     policy_documents(*),
     reviews(*),
     policy_claim_type:policy_claim_type(
       claim_type:claim_types(name)
     ),
     admin_details:admin_details!policies_created_by_fkey1(
       company:companies(name)
     )`,
        { count: 'exact' },
      )
      .range(offset, offset + (query.limit || 5) - 1)
      .order(query.sortBy || 'id', {
        ascending: (query.sortOrder || 'asc') === 'asc',
      });

    if (query.userId) {
      dbQuery = dbQuery.eq('created_by', query.userId);
    }

    if (query.category) {
      dbQuery = dbQuery.eq('category', query.category);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query.search}%,description.ilike.%${query.search}%`,
      );
    }

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error(
        '[Supabase] Failed to fetch policies with documents:',
        error.message,
      );
      throw new InternalServerErrorException('Error fetching policy data');
    }

    const allPaths: string[] = [];
    for (const policy of data) {
      if (Array.isArray(policy.policy_documents)) {
        for (const doc of policy.policy_documents) {
          if (doc.path) {
            allPaths.push(doc.path);
          }
        }
      }
    }

    const { data: coverageCounts } = await supabase.rpc('count_policy_sales');
    const { data: revenueCounts } = await supabase.rpc(
      'calculate_policy_revenue',
    );

    const coverageMap = new Map<number, number>();
    const revenueMap = new Map<number, number>();

    coverageCounts?.forEach((row: { policy_id: number; sales: number }) => {
      coverageMap.set(row.policy_id, row.sales);
    });

    revenueCounts?.forEach(
      (row: { policy_id: number; total_revenue: number }) => {
        revenueMap.set(row.policy_id, row.total_revenue);
      },
    );

    const signedUrls = await this.fileService.getSignedUrls(
      req.supabase,
      allPaths,
    );

    let urlIndex = 0;
    const enrichedPolicies: PolicyResponseDto[] = data.map((policy) => {
      const { policy_claim_type, admin_details, reviews, ...rest } =
        policy as any;

      return {
        ...rest,
        provider: admin_details?.company?.name || '',
        category: policy.category as PolicyCategory,
        policy_documents: Array.isArray(policy.policy_documents)
          ? policy.policy_documents.map((doc) => ({
              id: doc.id,
              name: doc.name,
              policy_id: doc.policy_id,
              path: doc.path,
              cid: doc.cid,
              signedUrl: signedUrls[urlIndex++] || '',
            }))
          : [],
        reviews: reviews || [],
        claim_types:
          policy_claim_type?.map((link) => link.claim_type.name) || [],
        sales: coverageMap.get(policy.id) || 0,
        revenue: revenueMap.get(policy.id) || 0,
      };
    });

    return new CommonResponseDto<PolicyResponseDto[]>({
      statusCode: 200,
      message: 'Policies retrieved successfully',
      data: enrichedPolicies,
      count: count || 0,
    });
  }

  async findOne(
    id: number,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<PolicyResponseDto>> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Step 1: Get the policy + claim types
    const { data: policy, error: policyError } = await req.supabase
      .from('policies')
      .select(
        `*, policy_claim_type:policy_claim_type(claim_type:claim_types(name)),
        admin_details:admin_details!policies_created_by_fkey1(
          company:companies(name)
        )`,
      )
      .eq('id', id)
      .single();

    if (policyError || !policy) {
      console.error(policyError);
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Step 2: Get related documents
    const { data: documents, error: docError } = await req.supabase
      .from('policy_documents')
      .select('*')
      .eq('policy_id', id);

    if (docError) {
      console.error(docError);
      throw new InternalServerErrorException('Failed to fetch documents');
    }

    const paths = (documents || []).map((d) => d.path);
    const signedUrls = await this.fileService.getSignedUrls(
      req.supabase,
      paths,
    );
    const enrichedDocuments = (documents || []).map((doc, idx) => ({
      id: doc.id,
      name: doc.name,
      policy_id: doc.policy_id,
      signedUrl: signedUrls[idx] || '',
    }));

    // Step 3: Get related reviews
    const { data: reviews, error: reviewError } = await req.supabase
      .from('reviews')
      .select('*')
      .eq('policy_id', id);

    if (reviewError) {
      console.error(reviewError);
      throw new InternalServerErrorException('Failed to fetch reviews');
    }

    const { policy_claim_type, category, admin_details, ...rest } =
      policy as any;

    console.log(enrichedDocuments);

    return new CommonResponseDto<PolicyResponseDto>({
      statusCode: 200,
      message: 'Policy retrieved successfully',
      data: {
        ...rest,
        provider: admin_details?.company?.name || '',
        category: category as PolicyCategory,
        policy_documents: enrichedDocuments,
        reviews: reviews || [],
        claim_types:
          policy_claim_type?.map((link) => link.claim_type.name) || [],
        sales: 0,
      },
    });
  }

  async getPolicyholderSummary(userId: string, req: AuthenticatedRequest) {
    const supabase = req.supabase;

    // 1. Fetch active policies by user
    const { data: policies, error: policyError } = await supabase
      .from('policies')
      .select('coverage, id')
      .eq('created_by', userId);

    if (policyError) {
      console.error(policyError);
      throw new InternalServerErrorException('Failed to fetch user policies');
    }

    const activePolicyCount = policies?.length || 0;
    const totalCoverage = policies?.reduce(
      (sum, p) => sum + (p.coverage || 0),
      0,
    );

    // 2. Fetch pending claims by user
    const { data: claims, error: claimError } = await supabase
      .from('claims')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (claimError) {
      console.error(claimError);
      throw new InternalServerErrorException('Failed to fetch pending claims');
    }
    const pendingClaims = claims?.length || 0;
    // 3. Return dashboard summary
    return {
      statusCode: 200,
      message: 'Dashboard summary fetched successfully',
      data: {
        activePolicies: activePolicyCount,
        totalCoverage,
        pendingClaims,
        walletBalance: null, // Can implement later
      },
    };
  }

  async getPoliciesWithClaimTypes(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<PolicyClaimTypesDto[]>> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data, error } = await req.supabase
      .from('coverage')
      .select(
        `id, 
       policy:policies(
         name,
         policy_claim_type:policy_claim_type(
           claim_type:claim_types(name)
         )
       )`,
      )
      .eq('user_id', userData.user.id);

    if (error) {
      throw new InternalServerErrorException(
        'Failed to fetch policies with claim types',
      );
    }

    const result: PolicyClaimTypesDto[] = (data || []).map((row: any) => ({
      id: Number(row.id),
      name: row.policy?.name ?? '',
      claim_types:
        row.policy?.policy_claim_type?.map((p: any) => p.claim_type.name) || [],
    }));

    return new CommonResponseDto<PolicyClaimTypesDto[]>({
      statusCode: 200,
      message: 'Policies with claim types retrieved successfully',
      data: result,
    });
  }

  async getPolicyCountByCategory(req: AuthenticatedRequest) {
    const supabase = req.supabase;

    const { data, error } = await supabase.from('policies').select('category');

    if (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }

    const categoryCounts: PolicyCategoryCountStatsDto = {
      travel: 0,
      health: 0,
      crop: 0,
    };

    for (const policy of data) {
      const category = policy.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Category counts fetched successfully',
      data: categoryCounts,
    });
  }

  async getStats(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<PolicyStatsDto>> {
    const supabase = req.supabase;

    const { count: activePolicies, error: activeError } = await supabase
      .from('policies')
      .select('id', { head: true, count: 'exact' })
      .eq('status', PolicyStatus.ACTIVE);
    if (activeError) {
      throw new InternalServerErrorException('Failed to count active policies');
    }

    const { count: deactivatedPolicies, error: deactivatedError } =
      await supabase
        .from('policies')
        .select('id', { head: true, count: 'exact' })
        .eq('status', PolicyStatus.DEACTIVATED);
    if (deactivatedError) {
      throw new InternalServerErrorException(
        'Failed to count deactivated policies',
      );
    }

    const { data: salesData, error: salesError } =
      await supabase.rpc('count_policy_sales');
    if (salesError) {
      throw new InternalServerErrorException('Failed to fetch policy sales');
    }
    const totalSales = (salesData || []).reduce(
      (sum: number, row: { sales: number }) => sum + (row.sales || 0),
      0,
    );

    const { data: revenueData, error: revenueError } = await supabase.rpc(
      'calculate_policy_revenue',
    );
    if (revenueError) {
      throw new InternalServerErrorException('Failed to calculate revenue');
    }
    const totalRevenue = (revenueData || []).reduce(
      (sum: number, row: { total_revenue: number }) =>
        sum + (row.total_revenue || 0),
      0,
    );

    return new CommonResponseDto<PolicyStatsDto>({
      statusCode: 200,
      message: 'Policy stats fetched successfully',
      data: new PolicyStatsDto({
        activePolicies: activePolicies || 0,
        deactivatedPolicies: deactivatedPolicies || 0,
        totalSales,
        totalRevenue,
      }),
    });
  }
  async update(id: number, dto: UpdatePolicyDto, req: AuthenticatedRequest) {
    const supabase = req.supabase;
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Step 1: Fetch existing policy
    const { data: existing, error: fetchError } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    const { claimTypes, ...policyData } = dto;

    // Step 3: Update policy
    const { data: updated, error: updateError } = await supabase
      .from('policies')
      .update(policyData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      throw new InternalServerErrorException('Failed to update policy');
    }

    // Step 4: Update claim types (if provided)
    if (claimTypes && claimTypes.length > 0) {
      // Step 4a: Remove old mappings
      const { error: deleteError } = await supabase
        .from('policy_claim_type')
        .delete()
        .eq('policy_id', id);

      if (deleteError) {
        throw new InternalServerErrorException(
          'Failed to clear old claim types',
        );
      }

      // Step 4b: Reattach new claim types (reuse your existing logic)
      await this.claimsService.attachClaimTypesToPolicy(claimTypes, id, req);
    }
    await this.activityLogger.log(
      `Updated Policy: ${dto.name}`,
      userData.user.id,
      req.ip,
    );

    return new CommonResponseDto({
      statusCode: 200,
      message: `Policy #${id} updated successfully`,
      data: updated,
    });
  }

  async remove(id: number, req: AuthenticatedRequest) {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data: existing, error: fetchError } = await req.supabase
      .from('policies')
      .select('id, name, status')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    if (existing.status === PolicyStatus.DEACTIVATED) {
      return new CommonResponseDto({
        statusCode: 200,
        message: `Policy #${id} already deactivated`,
        data: existing,
      });
    }

    const { error: updateError } = await req.supabase
      .from('policies')
      .update({ status: PolicyStatus.DEACTIVATED })
      .eq('id', id);

    if (updateError) {
      throw new InternalServerErrorException(
        'Failed to deactivate policy: ' + updateError.message,
      );
    }

    await this.activityLogger.log(
      `Deactivated Policy: ${existing.name}`,
      userData.user.id,
      req.ip,
    );

    return new CommonResponseDto({
      statusCode: 200,
      message: `Policy #${id} deactivated successfully`,
    });
  }
  async removeFile(filePath: string, req: AuthenticatedRequest): Promise<void> {
    if (!filePath.startsWith('ipfs://')) {
      await this.fileService.removeFileFromStorage(req.supabase, filePath);
    }
  }
}
