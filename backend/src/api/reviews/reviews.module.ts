import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, SupabaseService],
})
export class ReviewsModule {}
