import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';

@Injectable()
export class ReviewsService {
  async leavePolicyReview(
    policyId: number,
    reviewDto: CreateReviewDto,
    req: AuthenticatedRequest,
  ): Promise<any> {
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

    return {
      statusCode: 201,
      message: 'Review submitted successfully',
      data,
    };
  }
}
