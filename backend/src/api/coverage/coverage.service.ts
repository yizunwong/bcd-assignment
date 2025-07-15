import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
// import { SupabaseService } from 'src/supabase/supabase.service';
// import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';

@Injectable()
export class CoverageService {
  // constructor(private readonly supabaseService: SupabaseService) {}
  async create(dto: CreateCoverageDto, req: AuthenticatedRequest) {
    // const supabase = this.supabaseService.createClientWithToken();
    // return 'This action adds a new coverage';

    // ✅ Get user from request (from Bearer token)
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;

    // Step 1: Insert into `coverage`
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
  }

  findAll() {
    // const supabase = this.supabaseService.createClientWithToken();
    return `This action returns all coverage`;
  }

  findOne(id: number) {
    // const supabase = this.supabaseService.createClientWithToken();
    return `This action returns a #${id} coverage`;
  }

  // update(id: number, updateCoverageDto: UpdateCoverageDto) {
  //   // const supabase = this.supabaseService.createClientWithToken();
  //   return `This action updates a #${id} coverage`;
  // }

  remove(id: number) {
    // const supabase = this.supabaseService.createClientWithToken();
    return `This action removes a #${id} coverage`;
  }
}
