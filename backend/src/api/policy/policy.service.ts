import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
// import { SupabaseService } from 'src/supabase/supabase.service';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import {
  getSignedUrls,
  removeFileFromStorage,
  uploadFiles,
} from 'src/utils/supabase-storage';
import { CommonResponseDto } from 'src/common/common.dto';
import { PolicyResponseDto } from './dto/responses/policy.dto';
import { FindPoliciesQueryDto } from './dto/responses/policy-query.dto';

@Injectable()
export class PolicyService {
  async uploadPolicyDocuments(
    files: Array<Express.Multer.File>,
    req: AuthenticatedRequest,
  ): Promise<string[]> {
    return uploadFiles(req.supabase, files, 'policy_documents');
  }

  async create(
    dto: CreatePolicyDto,
    req: AuthenticatedRequest,
    files?: Array<Express.Multer.File>,
  ) {
    console.log(dto);
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Step 1: Insert policy
    const { data: policy, error: policyError } = await req.supabase
      .from('policies')
      .insert({
        name: dto.name,
        category: dto.category,
        provider: dto.provider,
        coverage: dto.coverage,
        premium: dto.premium,
        rating: dto.rating,
        popular: dto.popular,
        description: dto.description || null,
        features: dto.features,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (policyError || !policy) {
      console.error(policyError);
      throw new InternalServerErrorException('Failed to create policy');
    }

    const policyId = policy.id;

    // Step 2: Upload files to Supabase and insert metadata
    if (files && files.length > 0) {
      const path = await this.uploadPolicyDocuments(files, req);
      const docInserts = files.map((file, index) => ({
        policy_id: policyId,
        name: file.originalname,
        path: path[index],
      }));

      const { error: docError } = await req.supabase
        .from('policy_documents')
        .insert(docInserts);

      if (docError) {
        console.error(docError);
        throw new InternalServerErrorException('Failed to create documents');
      }
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Policy created successfully',
      data: policy,
    });
  }

  async findAll(
    req: AuthenticatedRequest,
    query: FindPoliciesQueryDto,
  ): Promise<CommonResponseDto<PolicyResponseDto[]>> {
    const sortableFields = ['id', 'name', 'rating', 'premium', 'popularity'];
    if (query.sortBy && !sortableFields.includes(query.sortBy)) {
      throw new BadRequestException(`Invalid sortBy field: ${query.sortBy}`);
    }

    const offset = ((query.page || 1) - 1) * (query.limit || 5);

    let dbQuery = req.supabase
      .from('policies')
      .select('*, policy_documents(*)', { count: 'exact' })
      .range(offset, offset + (query.limit || 5) - 1)
      .order(query.sortBy || 'id', {
        ascending: (query.sortOrder || 'asc') === 'asc',
      });

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

    const signedUrls = await getSignedUrls(req.supabase, allPaths);

    let urlIndex = 0;
    const enrichedPolicies: PolicyResponseDto[] = data.map((policy) => ({
      ...policy,
      policy_documents: Array.isArray(policy.policy_documents)
        ? policy.policy_documents.map((doc) => ({
            id: doc.id,
            name: doc.name,
            policy_id: doc.policy_id,
            signedUrl: signedUrls[urlIndex++] || '',
          }))
        : [],
    }));

    return new CommonResponseDto<PolicyResponseDto[]>({
      statusCode: 200,
      message: 'Policies retrieved successfully',
      data: enrichedPolicies,
      count: count || 0,
    });
  }

  async findOne(id: number, req: AuthenticatedRequest) {
    // const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Get the policy
    const { data: policy, error: policyError } = await req.supabase
      .from('policies')
      .select('*')
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
    const signedUrls = await getSignedUrls(req.supabase, paths);
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Policy retrieved successfully',
      data: {
        ...policy,
        policy_documents: enrichedDocuments,
        reviews: reviews || [],
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

  async getPolicyCountByCategory(req: AuthenticatedRequest) {
    const supabase = req.supabase;

    const { data, error } = await supabase.from('policies').select('category');

    if (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }

    const categoryCounts: Record<string, number> = {};

    for (const policy of data) {
      const category = policy.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    return {
      statusCode: 200,
      message: 'Policy categories counted successfully',
      data: categoryCounts,
    };
  }
  async update(id: number, dto: UpdatePolicyDto, req: AuthenticatedRequest) {
    const supabase = req.supabase;

    // Step 1: Fetch the existing policy
    const { data: existing, error: fetchError } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Step 2: Prepare the allowed fields ONLY
    const updateFields: Partial<typeof existing> = {};

    if (dto.name !== undefined) updateFields.name = dto.name;
    if (dto.category !== undefined) updateFields.category = dto.category;
    if (dto.provider !== undefined) updateFields.provider = dto.provider;
    if (dto.coverage !== undefined) updateFields.coverage = dto.coverage;
    if (dto.premium !== undefined) updateFields.premium = dto.premium;
    if (dto.rating !== undefined) updateFields.rating = dto.rating;
    if (dto.popular !== undefined) updateFields.popular = dto.popular;
    if (dto.description !== undefined)
      updateFields.description = dto.description;
    if (dto.features !== undefined) updateFields.features = dto.features;

    // Step 3: Perform the update
    const { data: updated, error: updateError } = await supabase
      .from('policies')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      throw new InternalServerErrorException('Failed to update policy');
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: `Policy #${id} updated successfully`,
      data: updated,
    });
  }

  async remove(id: number, req: AuthenticatedRequest) {
    // Step 1: Fetch policy documents
    const { data: documents, error: docsError } = await req.supabase
      .from('policy_documents')
      .select('path')
      .eq('policy_id', id);

    if (docsError) {
      throw new InternalServerErrorException(
        'Failed to fetch policy documents: ' + docsError.message,
      );
    }

    for (const doc of documents as { path: string }[]) {
      try {
        await removeFileFromStorage(req.supabase, doc.path);
      } catch {
        console.warn(`Failed to delete file "${doc.path}":`);
      }
    }

    const { error: docDeleteError } = await req.supabase
      .from('policy_documents')
      .delete()
      .eq('policy_id', id);

    if (docDeleteError) {
      throw new InternalServerErrorException(
        'Failed to remove policy documents: ' + docDeleteError.message,
      );
    }

    const { data: deleted, error: deleteError } = await req.supabase
      .from('policies')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError) {
      throw new InternalServerErrorException(
        'Failed to delete policy: ' + deleteError.message,
      );
    }

    if (!deleted) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: `Policy #${id} deleted successfully`,
      data: deleted,
    });
  }
  async removeFile(filePath: string, req: AuthenticatedRequest): Promise<void> {
    await removeFileFromStorage(req.supabase, filePath);
  }
}
