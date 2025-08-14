import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { CommonResponseDto } from 'src/common/common.dto';
import { CreateReviewDto } from './dto/requests/create-review.dto';

@Injectable()
export class ReviewsService {
  async leavePolicyReview(
    policyId: number,
    reviewDto: CreateReviewDto,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    // ✅ Step 1: Get authenticated user
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;

    // ✅ Step 2: Get user's full name from user_details
    const { data: profile, error: profileError } = await req.supabase
      .from('user_details')
      .select('first_name, last_name')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      throw new InternalServerErrorException('Failed to fetch user profile');
    }

    const user_name = `${profile.first_name} ${profile.last_name}`;

    // ✅ Step 3: Insert into reviews table
    const { data, error } = await req.supabase
      .from('reviews')
      .insert([
        {
          policy_id: policyId,
          user_id,
          user_name,
          rating: reviewDto.rating,
          comment: reviewDto.comment || null,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new InternalServerErrorException(
        'Failed to submit review: ' + (error?.message || 'Unknown error'),
      );
    }

    // ✅ Step 4: Recalculate average rating for the policy
    const { data: ratings, error: ratingsError } = await req.supabase
      .from('reviews')
      .select('rating')
      .eq('policy_id', policyId);

    if (ratingsError || !ratings) {
      throw new InternalServerErrorException(
        'Failed to recalculate policy rating',
      );
    }

    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    const { error: updateError } = await req.supabase
      .from('policies')
      .update({ rating: avgRating })
      .eq('id', policyId);

    if (updateError) {
      throw new InternalServerErrorException(
        'Failed to update policy rating',
      );
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Review submitted successfully',
      data,
    });
  }
}
