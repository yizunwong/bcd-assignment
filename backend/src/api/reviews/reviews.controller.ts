import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/common.dto';
import { CreateReviewDto } from './dto/requests/create-review.dto';

@Controller('reviews')
@ApiBearerAuth('supabase-auth')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/policy/:id/review')
  @UseGuards(AuthGuard)
  async leaveReview(
    @Param('id') id: string,
    @Body() reviewDto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    return this.reviewsService.leavePolicyReview(+id, reviewDto, req);
  }

  // @Post()
  // create(@Body() createReviewDto: CreateReviewDto) {
  //   return this.reviewsService.create(createReviewDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reviewsService.findOne(+id);
  // }
}
