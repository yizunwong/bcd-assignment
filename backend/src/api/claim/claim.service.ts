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
      message: 'Claim created successfully',
      data: data,
    };
  }

  async findAll(
    req: any, // Replace with AuthenticatedRequest if applicable
    page: number = 1,
    limit: number = 5,
    category?: string,
    search?: string,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();
    const offset = (page - 1) * limit;

    // Build the base query for claims
    let query = supabase
      .from('claims')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);

    // Apply filtering by category if provided
    if (category) {
      query = query.eq('category', category); // Adjust 'category' to a valid claims column if it exists
    }

    // Apply search across relevant fields (e.g., claim_type, description)
    if (search) {
      query = query.or(
        `claim_type.ilike.%${search}%,description.ilike.%${search}%`,
      );
    }

    // Define sortable fields for claims
    const sortableFields = [
      'id',
      'claim_type',
      'amount',
      'status',
      'submitted_date',
    ]; // Adjust based on your schema
    if (sortableFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    // Execute the claims query
    const { data: claims, error: claimsError, count } = await query;
    if (claimsError) {
      console.error('Claims fetch error:', claimsError.message);
      throw new InternalServerErrorException('Failed to fetch claims');
    }

    // Fetch documents with pagination and filtering by claim_id
    const { data: documents, error: docsError } = await supabase
      .from('claim_documents')
      .select('*')
      .in(
        'claim_id',
        claims.map((claim) => claim.id),
      ); // Only fetch documents for the retrieved claims
    if (docsError) {
      console.error('Documents fetch error:', docsError.message);
      throw new InternalServerErrorException('Failed to fetch claim documents');
    }

    // Attach documents to their respective claims
    const claimsWithDocs = claims.map((claim) => ({
      ...claim,
      documents: documents.filter((doc) => doc.claim_id === claim.id),
    }));

    // Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      statusCode: 200,
      message: 'Claims retrieved successfully',
      metadata: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: claimsWithDocs,
    };
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

  async remove(id: number, req: AuthenticatedRequest): Promise<any> {
    const supabase = this.supabaseService.createClientWithToken();

    // Fetch claim documents before deleting claim
    const { data: documents, error: fetchDocError } = await supabase
      .from('claim_documents')
      .select('*')
      .eq('claim_id', id);

    if (fetchDocError) {
      throw new Error(
        'Failed to fetch claim documents: ' +
          (fetchDocError?.message || 'Unknown error'),
      );
    }

    if (documents && documents.length > 0) {
      // const req = { supabase } as AuthenticatedRequest;
      for (const doc of documents) {
        const urlPaths = doc.url.split('/');
        const filePath = decodeURIComponent(urlPaths.slice(-2).join('/'));
        console.log('Url path to remove:', urlPaths);
        console.log('Removing file:', filePath);
        await this.removeFile(filePath, req);
      }
    }

    // Remove related claim documents from the database
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

  async removeFile(filePath: string, req: AuthenticatedRequest): Promise<void> {
    try {
      console.log('Auth session:', await req.supabase.auth.getSession());
      console.log('Attempting to remove file at path:', filePath);
      const { data, error } = await req.supabase.storage
        .from('supastorage')
        .remove([filePath]);

      if (error) {
        console.error('File removal error details:', {
          message: error.message,
        });
        throw new InternalServerErrorException(
          'Failed to remove file from storage: ' + error.message,
        );
      }
      console.log('File removal successful, data:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Caught error during file removal:', error.message);
        throw new InternalServerErrorException(error.message);
      } else {
        console.error('Unknown error during file removal:', error);
        throw new InternalServerErrorException(
          'An unknown error occurred while removing the file',
        );
      }
    }
  }
}
