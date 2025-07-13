import { Injectable } from '@nestjs/common';
import { CreateCoverageDto } from './dto/requests/create-coverage.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateCoverageDto } from './dto/requests/update-coverage.dto';

@Injectable()
export class CoverageService {
  constructor(private readonly supabaseService: SupabaseService) {}
  create(createCoverageDto: CreateCoverageDto) {
    const supabase = this.supabaseService.createClientWithToken();
    return 'This action adds a new coverage';
  }

  findAll() {
    const supabase = this.supabaseService.createClientWithToken();
    return `This action returns all coverage`;
  }

  findOne(id: number) {
    const supabase = this.supabaseService.createClientWithToken();
    return `This action returns a #${id} coverage`;
  }

  update(id: number, updateCoverageDto: UpdateCoverageDto) {
    const supabase = this.supabaseService.createClientWithToken();
    return `This action updates a #${id} coverage`;
  }

  remove(id: number) {
    const supabase = this.supabaseService.createClientWithToken();
    return `This action removes a #${id} coverage`;
  }
}
