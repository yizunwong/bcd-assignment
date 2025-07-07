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

@Injectable()
export class PolicyService {
  // constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreatePolicyDto, req: AuthenticatedRequest) {
    // const supabase = this.supabaseService.createClientWithToken();

    // ✅ Get user from request (from Bearer token)
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;
    const user_name = userData.user.user_metadata?.username || 'Anonymous';

    // Step 1: Insert into `policies`
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

    // Step 2: Insert documents if provided
    if (dto.documents?.length) {
      const docInserts = dto.documents.map((doc) => ({
        policy_id: policyId,
        name: doc.name,
        url: doc.url,
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

    return {
      statusCode: 201,
      message: 'Policy created successfully',
      data: policy,
    };
  }

  async findAll(req: AuthenticatedRequest) {
    // const supabase = this.supabaseService.createClientWithToken();

    const { data, error } = await req.supabase
      .from('policies')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch policies');
    }

    return {
      statusCode: 200,
      message: 'Policies retrieved successfully',
      data,
    };
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

    // Step 3: Get related reviews
    const { data: reviews, error: reviewError } = await req.supabase
      .from('reviews')
      .select('*')
      .eq('policy_id', id);

    if (reviewError) {
      console.error(reviewError);
      throw new InternalServerErrorException('Failed to fetch reviews');
    }

    return {
      statusCode: 200,
      message: 'Policy retrieved successfully',
      data: {
        ...policy,
        documents: documents || [],
        reviews: reviews || [],
      },
    };
  }
  async update(
    id: number,
    updatePolicyDto: UpdatePolicyDto,
    req: AuthenticatedRequest,
  ) {
    // const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Ensure policy exists
    const { data: existing, error: fetchError } = await req.supabase
      .from('policies')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Step 2: Update the policy
    const { data: updated, error: updateError } = await req.supabase
      .from('policies')
      .update({
        ...updatePolicyDto,
        updated_at: new Date().toISOString(), // optional if you track timestamps
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      throw new InternalServerErrorException('Failed to update policy');
    }

    return {
      statusCode: 200,
      message: `Policy #${id} updated successfully`,
      data: updated,
    };
  }

  async remove(id: number, req: AuthenticatedRequest) {
    // const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Check if policy exists
    const { data: existing, error: fetchError } = await req.supabase
      .from('policies')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    // Step 2: Delete the policy
    const { error: deleteError } = await req.supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      throw new InternalServerErrorException('Failed to delete policy');
    }

    return {
      statusCode: 200,
      message: `Policy #${id} deleted successfully`,
    };
  }
}
