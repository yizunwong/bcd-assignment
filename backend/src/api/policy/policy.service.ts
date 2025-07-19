/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
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
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class PolicyService {
  constructor(private readonly supabaseService: SupabaseService) {}

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
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;
    const user_name = userData.user.user_metadata?.username || 'Anonymous';

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
      const urls = await this.uploadPolicyDocuments(files, req);
      const docInserts = files.map((file, index) => ({
        policy_id: policyId,
        name: file.originalname,
        url: urls[index],
      }));

      const { error: docError } = await req.supabase
        .from('policy_documents')
        .insert(docInserts);

      if (docError) {
        console.error(docError);
        throw new InternalServerErrorException('Failed to create documents');
      }
    }

    // Step 3: Insert reviews if provided
    if (dto.reviews?.length) {
      const reviewInserts = dto.reviews.map((review) => ({
        policy_id: policyId,
        user_id: user_id,
        user_name: user_name,
        rating: review.rating,
        comment: review.comment || null,
      }));

      const { error: reviewError } = await req.supabase
        .from('reviews')
        .insert(reviewInserts);

      if (reviewError) {
        console.error(reviewError);
        throw new InternalServerErrorException('Failed to create reviews');
      }
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Policy created successfully',
      data: policy,
    });
  }

  async findAll(
    req: AuthenticatedRequest, // ✅ required first
    page = 1,
    limit = 5,
    category?: string,
    search?: string,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const supabase = req.supabase;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('policies')
      .select('*, policy_documents(*)', { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const sortableFields = ['id', 'name', 'rating', 'premium', 'popularity'];
    if (sortableFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch policies');
    }

    const totalItems = count || 0;

    const allPaths: string[] = [];
    for (const policy of data) {
      if (Array.isArray(policy.policy_documents)) {
        for (const doc of policy.policy_documents) {
          if (doc.url) {
            allPaths.push(doc.url);
          }
        }
      }
    }

    const signedUrls = await getSignedUrls(req.supabase, allPaths);

    let urlIndex = 0;
    const enriched = data.map((policy) => ({
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Policies retrieved successfully',
      data: enriched,
      count: totalItems,
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

    const paths = (documents || []).map((d) => d.url);
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
        documents: enrichedDocuments,
        reviews: reviews || [],
      },
    });
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
    const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Fetch policy documents
    const { data: documents, error: docsError } = await supabase
      .from('policy_documents')
      .select('url')
      .eq('policy_id', id);

    if (docsError) {
      throw new InternalServerErrorException(
        'Failed to fetch policy documents: ' + docsError.message,
      );
    }

    for (const doc of (documents as { url: string }[])) {
      try {
        await removeFileFromStorage(supabase, doc.url);
      } catch {
        console.warn(`Failed to delete file "${doc.url}":`);
      }
    }

    const { error: docDeleteError } = await supabase
      .from('policy_documents')
      .delete()
      .eq('policy_id', id);

    if (docDeleteError) {
      throw new InternalServerErrorException(
        'Failed to remove policy documents: ' + docDeleteError.message,
      );
    }

    const { data: deleted, error: deleteError } = await supabase
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
