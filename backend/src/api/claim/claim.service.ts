import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { UploadClaimDocDto } from './dto/requests/upload-claim-doc.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { FindClaimsQueryDto } from './dto/responses/find-claims-query.dto';
import {
  getSignedUrls,
  removeFileFromStorage,
  uploadFiles,
} from 'src/utils/supabase-storage';
import { ClaimResponseDto } from './dto/responses/claim.dto';
import { CommonResponseDto } from 'src/common/common.dto';
@Injectable()
export class ClaimService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // async uploadClaimDocument(
  //   files: Array<Express.Multer.File>,
  //   req: AuthenticatedRequest,
  // ): Promise<string[]> {
  //   try {
  //     const fileArray = Array.isArray(files) ? files : [files];
  //     return await uploadFiles(req.supabase, fileArray, 'claim_documents');
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new InternalServerErrorException(error.message);
  //     }
  //     throw new InternalServerErrorException(
  //       'An unknown error occurred during file upload',
  //     );
  //   }
  // }

  async createClaim(
    createClaimDto: CreateClaimDto,
    req: AuthenticatedRequest,
    files: Array<Express.Multer.File>,
  ): Promise<any> {
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
          description: createClaimDto.description ?? null,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new InternalServerErrorException(
        'Failed to create claim: ' + (error?.message || 'Unknown error'),
      );
    }

    const claimId = data.id;

    if (files?.length > 0) {
      const filePaths = await uploadFiles(
        req.supabase,
        files,
        'claim_documents',
      );
      const docInserts = files.map((file, index) => ({
        claim_id: claimId,
        name: file.originalname,
        path: filePaths[index],
      }));

      const { error: docError } = await req.supabase
        .from('claim_documents')
        .insert(docInserts);

      if (docError) {
        console.error(docError);
        throw new InternalServerErrorException('Failed to create documents');
      }
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Claim created successfully',
    });
  }

  async findAll(req: AuthenticatedRequest, query: FindClaimsQueryDto) {
    if (
      query.sortBy &&
      !['id', 'claim_type', 'amount', 'status', 'submitted_date'].includes(
        query.sortBy,
      )
    ) {
      throw new BadRequestException(`Invalid sortBy field: ${query.sortBy}`);
    }

    const offset = ((query.page || 1) - 1) * (query.limit || 5);

    let dbQuery = req.supabase
      .from('claims')
      .select('*, claim_documents(*)', { count: 'exact' })
      .range(offset, offset + (query.limit || 5) - 1)
      .order(query.sortBy || 'id', {
        ascending: (query.sortOrder || 'asc') === 'asc',
      });

    if (query.category) {
      dbQuery = dbQuery.eq('claim_type', query.category);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `claim_type.ilike.%${query.search}%,description.ilike.%${query.search}%`,
      );
    }

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error(
        '[Supabase] Failed to fetch claims with documents:',
        error.message,
      );
      throw new InternalServerErrorException('Error fetching claim data');
    }

    // Step 1: Collect all document paths
    const allPaths: string[] = [];
    for (const claim of data) {
      if (Array.isArray(claim.claim_documents)) {
        for (const doc of claim.claim_documents) {
          if (doc.path) {
            allPaths.push(doc.path);
          }
        }
      }
    }

    const signedUrls = await getSignedUrls(req.supabase, allPaths);

    let urlIndex = 0;
    const enrichedClaims: ClaimResponseDto[] = data.map((claim) => ({
      ...claim,
      claim_documents: Array.isArray(claim.claim_documents)
        ? claim.claim_documents.map((doc) => ({
            id: doc.id,
            name: doc.name,
            claim_id: doc.claim_id,
            signedUrl: signedUrls[urlIndex++] || '',
          }))
        : [],
    }));

    return new CommonResponseDto<ClaimResponseDto[]>({
      statusCode: 200,
      message: 'Claims retrieved successfully',
      data: enrichedClaims,
      count: count || 0,
    });
  }

  async findOne(req: AuthenticatedRequest, id: number): Promise<any> {
    const { data, error } = await req.supabase
      .from('claims')
      .select('*, claim_documents(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(
        'Failed to fetch claim with documents: ' +
          (error?.message || 'Unknown error'),
      );
    }

    const documents = data.claim_documents || [];

    const filePaths = documents
      .map((doc: UploadClaimDocDto) => doc.path)
      .filter(Boolean);

    // Generate signed URLs
    const signedUrls = await getSignedUrls(req.supabase, filePaths);

    const enrichedDocuments = documents.map((doc, idx) => ({
      ...doc,
      signedUrl: signedUrls[idx] || null,
    }));

    return {
      ...data,
      claim_documents: enrichedDocuments,
    };
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
        description: updateClaimDto.description ?? null,
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

  async remove(id: number, req: AuthenticatedRequest): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Fetch claim documents
    const { data: documents, error: fetchDocError } = await supabase
      .from('claim_documents')
      .select('path')
      .eq('claim_id', id);

    if (fetchDocError) {
      throw new InternalServerErrorException(
        'Failed to fetch claim documents: ' + fetchDocError.message,
      );
    }

    // Step 2: Remove files from Supabase storage
    for (const doc of documents as { path: string }[]) {
      try {
        await removeFileFromStorage(supabase, doc.path);
      } catch (err) {
        console.warn(`Failed to delete file "${doc.path}":`);
      }
    }

    // Step 3: Remove claim_documents from database
    const { error: docDeleteError } = await supabase
      .from('claim_documents')
      .delete()
      .eq('claim_id', id);

    if (docDeleteError) {
      throw new InternalServerErrorException(
        'Failed to remove claim documents: ' + docDeleteError.message,
      );
    }

    // Step 4: Remove the claim itself
    const { data: deletedClaim, error: claimDeleteError } = await supabase
      .from('claims')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (claimDeleteError) {
      throw new InternalServerErrorException(
        'Failed to remove claim: ' + claimDeleteError.message,
      );
    }

    if (!deletedClaim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return deletedClaim;
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
  async removeClaimDocument(id: number): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();

    // Step 1: Fetch the document to get its path
    const { data: document, error: fetchError } = await supabase
      .from('claim_documents')
      .select('id, path')
      .eq('id', id)
      .single();

    if (fetchError || !document) {
      throw new NotFoundException(
        'Claim document not found: ' + (fetchError?.message || 'Unknown error'),
      );
    }

    // Step 2: Remove the file from Supabase storage
    try {
      await removeFileFromStorage(supabase, document.path);
    } catch (error) {
      console.warn(`File removal failed for "${document.path}":`);
      // Optional: decide if you want to proceed with DB delete or not
    }

    // Step 3: Remove the claim document record from the database
    const { data, error: deleteError } = await supabase
      .from('claim_documents')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (deleteError || !data) {
      throw new InternalServerErrorException(
        'Failed to remove claim document: ' +
          (deleteError?.message || 'Unknown error'),
      );
    }

    return data;
  }

  // async findClaimDocumentById(id: number): Promise<any> {
  //   const supabase = this.supabaseService.createClientWithToken();
  //   const { data, error } = await supabase
  //     .from('claim_documents')
  //     .select('*')
  //     .eq('id', id)
  //     .single();
  //   if (error || !data) {
  //     throw new Error(
  //       'Failed to fetch claim document: ' +
  //         (error?.message || 'Unknown error'),
  //     );
  //   }
  //   return data;
  // }
  // async updateClaimDocument(
  //   id: number,
  //   uploadClaimDocDto: UploadClaimDocDto,
  // ): Promise<any> {
  //   const supabase = this.supabaseService.createClientWithToken();
  //   const { data, error } = await supabase
  //     .from('claim_documents')
  //     .update({
  //       claim_id: uploadClaimDocDto.claim_id,
  //       name: uploadClaimDocDto.name,
  //       path: uploadClaimDocDto.path,
  //     })
  //     .eq('id', id)
  //     .select()
  //     .single();
  //   if (error || !data) {
  //     throw new Error(
  //       'Failed to update claim document: ' +
  //         (error?.message || 'Unknown error'),
  //     );
  //   }
  //   return data;
  // }
}
