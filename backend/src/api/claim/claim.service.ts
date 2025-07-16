import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { UploadClaimDocDto } from './dto/requests/upload-claim-doc.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
@Injectable()
export class ClaimService {
  constructor(private readonly supabaseService: SupabaseService) {}
  // create(createClaimDto: CreateClaimDto) {
  //   const supabase = this.supabaseService.createClientWithToken();
  //   return 'This action adds a new claim';
  // }
  async uploadClaimDocument(
    files: Array<Express.Multer.File>,
    req: AuthenticatedRequest,
  ) {
    try {
      const fileArray = Array.isArray(files) ? files : [files];
      const urls: string[] = [];

      for (const file of fileArray) {
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.originalname}`;
        const filePath = `claim_documents/${uniqueName}`;
        const { error: uploadError } = await req.supabase.storage
          .from('supastorage')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          throw new InternalServerErrorException(uploadError.message);
        }

        const { data } = req.supabase.storage
          .from('supastorage')
          .getPublicUrl(filePath);
        const url = data.publicUrl;
        urls.push(url);
      }
      return urls;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      } else {
        throw new InternalServerErrorException('An unknown error occurred');
      }
    }
  }

  async createClaim(
    createClaimDto: CreateClaimDto,
    req: AuthenticatedRequest,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    // ✅ Get user from request (from Bearer token)
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user_id = userData.user.id;
    const { data, error } = await req.supabase
      .from('claims')
      .insert([
        {
          policy_id: createClaimDto.policy_id,
          user_id: user_id,
          claim_type: createClaimDto.claim_type,
          amount: createClaimDto.amount,
          status: 'pending',
          submitted_date: new Date().toISOString(),
          processed_date: null,
          claimed_date: null,
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

    const claimId = data.id;

    // Step 2: Insert documents if provided
    if (files && files.length > 0) {
      const urls = await this.uploadClaimDocument(files, req);
      const docInserts = files.map((file, index) => ({
        claim_id: claimId,
        name: file.originalname,
        url: urls[index],
      }));

      const { error: docError } = await req.supabase
        .from('claim_documents')
        .insert(docInserts);

      if (docError) {
        console.error(docError);
        throw new InternalServerErrorException('Failed to create documents');
      }
    }
    // Return the created claim data
    return {
      statusCode: 201,
      message: 'Policy created successfully',
      data: data,
    };
  }

  async findAll(): Promise<any[]> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select('*');
    if (claimsError) {
      throw new Error(
        'Failed to fetch claims: ' + (claimsError.message || 'Unknown error'),
      );
    }

    // Fetch all claim documents
    const { data: documents, error: docsError } = await supabase
      .from('claim_documents')
      .select('*');
    if (docsError) {
      throw new Error(
        'Failed to fetch claim documents: ' +
          (docsError.message || 'Unknown error'),
      );
    }

    // Attach documents to their respective claims
    const claimsWithDocs = claims.map((claim) => ({
      ...claim,
      documents: documents.filter((doc) => doc.claim_id === claim.id),
    }));

    return claimsWithDocs;
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

    const { data: docData, error: docError } = await supabase
      .from('claim_documents')
      .select('*')
      .eq('claim_id', id);

    if (docError || !docData) {
      throw new Error(
        'Failed to fetch claim documents: ' +
          (docError.message || 'Unknown error'),
      );
    }
    return { ...data, documents: docData }; // Include documents in the response data;
  }

  async update(
    id: number,
    updateClaimDto: UpdateClaimDto,
    req: AuthenticatedRequest,
  ): Promise<any> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user_id = userData.user.id;
    const { data, error } = await req.supabase
      .from('claims')
      .update({
        policy_id: updateClaimDto.policy_id,
        user_id: user_id,
        claim_type: updateClaimDto.claim_type,
        amount: updateClaimDto.amount,
        status: updateClaimDto.status as 'pending' | 'approved' | 'rejected',
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

    // Remove related claim documents first
    const { error: docError } = await supabase
      .from('claim_documents')
      .delete()
      .eq('claim_id', id);

    if (docError) {
      throw new Error(
        'Failed to remove claim documents: ' +
          (docError?.message || 'Unknown error'),
      );
    }

    // Then remove the claim itself
    const { data, error } = await supabase
      .from('claims')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(
        'Failed to remove claim: ' + (error?.message || 'Unknown error'),
      );
    }
    return data;
  }

  async createClaimDocument(
    uploadClaimDocDto: UploadClaimDocDto,
  ): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claim_documents')
      .insert([
        {
          claim_id: uploadClaimDocDto.claim_id,
          name: uploadClaimDocDto.name,
          url: uploadClaimDocDto.url,
        },
      ])
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to create claim document: ' +
          (error?.message || 'Unknown error'),
      );
    }
    return data;
  }
  async findAllClaimDocuments(): Promise<any[]> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase.from('claim_documents').select('*');
    if (error) {
      throw new Error(
        'Failed to fetch claim documents: ' +
          (error.message || 'Unknown error'),
      );
    }
    return data;
  }
  async findClaimDocumentById(id: number): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claim_documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to fetch claim document: ' +
          (error?.message || 'Unknown error'),
      );
    }
    return data;
  }
  async updateClaimDocument(
    id: number,
    uploadClaimDocDto: UploadClaimDocDto,
  ): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claim_documents')
      .update({
        claim_id: uploadClaimDocDto.claim_id,
        name: uploadClaimDocDto.name,
        url: uploadClaimDocDto.url,
      })
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to update claim document: ' +
          (error?.message || 'Unknown error'),
      );
    }
    return data;
  }
  async removeClaimDocument(id: number): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const { data, error } = await supabase
      .from('claim_documents')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      throw new Error(
        'Failed to remove claim document: ' +
          (error?.message || 'Unknown error'),
      );
    }
    return data;
  }
}
