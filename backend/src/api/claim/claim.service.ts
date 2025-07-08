import { Injectable } from '@nestjs/common';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateClaimDto } from './dto/requests/create-claim.dto';

@Injectable()
export class ClaimService {
  constructor(private readonly supabaseService: SupabaseService) {}
  // create(createClaimDto: CreateClaimDto) {
  //   const supabase = this.supabaseService.createClientWithToken();
  //   return 'This action adds a new claim';
  // }

  async createClaim(createClaimDto: CreateClaimDto): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claims')
      .insert([
        {
          policy_id: createClaimDto.policy_id,
          user_id: createClaimDto.user_id,
          claim_type: createClaimDto.claim_type,
          amount: createClaimDto.amount,
          status: createClaimDto.status as 'pending',
          submitted_date: createClaimDto.submitted_date,
          processed_date: createClaimDto.processed_date ?? null,
          claimed_date: createClaimDto.claimed_date ?? null,
          description: createClaimDto.description ?? null, // Assuming documents is an array of strings
        },
      ])
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to create claim: ' + (error?.message || 'Unknown error'),
      );
    }
    return data;
  }

  async findAll(): Promise<any[]> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase.from('claims').select('*');
    if (error) {
      throw new Error(
        'Failed to fetch claims: ' + (error.message || 'Unknown error'),
      );
    }
    return data;
  }

  async findOne(id: number): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to fetch claims: ' + (error.message || 'Unknown error'),
      );
    }
    return data;
  }

  async update(id: number, updateClaimDto: UpdateClaimDto): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claims')
      .update({
        policy_id: updateClaimDto.policy_id,
        user_id: updateClaimDto.user_id,
        claim_type: updateClaimDto.claim_type,
        amount: updateClaimDto.amount,
        status: updateClaimDto.status as 'pending' | 'approved' | 'rejected',
        submitted_date: updateClaimDto.submitted_date,
        processed_date: updateClaimDto.processed_date ?? null,
        claimed_date: updateClaimDto.claimed_date ?? null,
        description: updateClaimDto.description ?? null, // Assuming documents is an array of strings
      })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to fetch claims: ' + (error.message || 'Unknown error'),
      );
    }
    return data;
  }

  async remove(id: number): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claims')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to remove claim: ' + (error.message || 'Unknown error'),
      );
    }
    return data;
  }
}
