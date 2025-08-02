import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { UploadClaimDocDto } from './dto/requests/upload-claim-doc.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { FindClaimsQueryDto } from './dto/responses/claims-query.dto';
import { FileService } from '../file/file.service';
import { ClaimResponseDto } from './dto/responses/claim.dto';
import { ClaimStatsDto } from './dto/responses/claim-stats.dto';
import { CommonResponseDto } from 'src/common/common.dto';
import { ClaimStatus } from 'src/enums';
@Injectable()
export class ClaimService {
  constructor(private readonly fileService: FileService) {}
  async createClaim(
    createClaimDto: CreateClaimDto,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
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
          coverage_id: createClaimDto.coverage_id,
          submitted_by: user_id,
          type: createClaimDto.type,
          priority: createClaimDto.priority,
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

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Claim created successfully',
      data: { id: claimId },
    });
  }

  async addClaimDocuments(
    claimId: number,
    files: Array<Express.Multer.File>,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const paths = await this.fileService.uploadFiles(
      req.supabase,
      files,
      'claim_documents',
      userData.user.id,
    );

    const inserts = files.map((file, idx) => ({
      claim_id: claimId,
      name: file.originalname,
      path: paths[idx],
    }));

    const { error } = await req.supabase
      .from('claim_documents')
      .insert(inserts);

    if (error) {
      throw new InternalServerErrorException(
        'Failed to create claim documents',
      );
    }

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Claim Documents uploaded successfully',
    });
  }

  async findAll(
    req: AuthenticatedRequest,
    query: FindClaimsQueryDto,
  ): Promise<CommonResponseDto<ClaimResponseDto[]>> {
    if (
      query.sortBy &&
      !['id', 'type', 'amount', 'status', 'submitted_date'].includes(
        query.sortBy,
      )
    ) {
      throw new BadRequestException(`Invalid sortBy field: ${query.sortBy}`);
    }

    const offset = ((query.page || 1) - 1) * (query.limit || 5);

    let dbQuery = req.supabase
      .from('claims')
      .select(
        `*, claim_documents(*), user_details(*), policyholder_details(*), coverage:coverage_id(
          policy:policy_id(id,name,provider,coverage,premium)
        )`,
        { count: 'exact' },
      )
      .range(offset, offset + (query.limit || 5) - 1)
      .order(query.sortBy || 'id', {
        ascending: (query.sortOrder || 'asc') === 'asc',
      });

    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `type.ilike.%${query.search}%,description.ilike.%${query.search}%`,
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

    const signedUrls = await this.fileService.getSignedUrls(
      req.supabase,
      allPaths,
    );

    let urlIndex = 0;
    const enrichedClaims: ClaimResponseDto[] = data.map((claim) => {
      const documents = Array.isArray(claim.claim_documents)
        ? claim.claim_documents.map((doc) => ({
            id: doc.id,
            name: doc.name,
            claim_id: doc.claim_id,
            signedUrl: signedUrls[urlIndex++] || '',
          }))
        : [];

      return {
        id: claim.id,
        type: claim.type,
        amount: claim.amount,
        status: claim.status,
        description: claim.description || '',
        submitted_date: claim.submitted_date,
        priority: claim.priority,
        submitted_by:
          `${claim.user_details?.first_name ?? ''} ${claim.user_details?.last_name ?? ''}`.trim(),
        claim_documents: documents,
        policyholder_details: claim.policyholder_details || undefined,
        policy: claim.coverage?.policy
          ? {
              id: claim.coverage.policy.id,
              name: claim.coverage.policy.name,
              provider: claim.coverage.policy.provider,
              coverage: claim.coverage.policy.coverage,
              premium: claim.coverage.policy.premium,
            }
          : undefined,
      };
    });

    return new CommonResponseDto<ClaimResponseDto[]>({
      statusCode: 200,
      message: 'Claims retrieved successfully',
      data: enrichedClaims,
      count: count || 0,
    });
  }

  async findOne(
    req: AuthenticatedRequest,
    id: number,
  ): Promise<CommonResponseDto<ClaimResponseDto>> {
    const { data, error } = await req.supabase
      .from('claims')
      .select(
        `*, claim_documents(*), user_details(*), policyholder_details(*), coverage:coverage_id(
          policy:policy_id(id,name,provider,coverage,premium)
        )`,
      )
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
    const signedUrls = await this.fileService.getSignedUrls(
      req.supabase,
      filePaths,
    );

    const enrichedDocuments = documents.map((doc, idx) => ({
      ...doc,
      signedUrl: signedUrls[idx],
    }));

    const claim: ClaimResponseDto = {
      id: data.id,
      type: data.type,
      amount: data.amount,
      status: data.status,
      description: data.description || '',
      submitted_date: data.submitted_date,
      priority: data.priority,
      submitted_by:
        `${data.user_details?.first_name ?? ''} ${data.user_details?.last_name ?? ''}`.trim(),
      claim_documents: enrichedDocuments,
      policyholder_details: data.policyholder_details || undefined,
      policy: data.coverage?.policy
        ? {
            id: data.coverage.policy.id,
            name: data.coverage.policy.name,
            provider: data.coverage.policy.provider,
            coverage: data.coverage.policy.coverage,
            premium: data.coverage.policy.premium,
          }
        : undefined,
    };

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim retrieved successfully',
      data: claim,
    });
  }

  async update(
    id: number,
    updateClaimDto: UpdateClaimDto,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();

    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user_id = userData.user.id;
    const { data, error } = await req.supabase
      .from('claims')
      .update({
        coverage_id: updateClaimDto.coverage_id,
        user_id: user_id,
        type: updateClaimDto.type,
        priority: updateClaimDto.priority,
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim updated successfully',
      data,
    });
  }

  //For admin to update claim status
  async updateClaimStatus(
    id: number,
    status: ClaimStatus,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    // Authenticate the user
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Update only the status field
    const { data, error } = await req.supabase
      .from('claims')
      .update({
        status: status,
      })
      .eq('id', id)
      .select()
      .single();

    // Handle errors
    if (error || !data) {
      throw new Error(
        'Failed to update claim status: ' + (error?.message || 'Unknown error'),
      );
    }

    if (status === ClaimStatus.APPROVED) {
      // Fetch the claim to get policy_id and user_id
      const { data: claim, error: claimError } = await req.supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single();
      if (!claim || claimError) {
        throw new Error('Failed to fetch claim for utilization update');
      }
      if (claim.coverage_id == null || claim.submitted_by == null) {
        throw new Error('Claim is missing policy_id or user_id');
      }
      // Fetch the coverage for this user and policy
      const { data: coverage, error: coverageError } = await req.supabase
        .from('coverage')
        .select('*')
        .eq('id', claim.coverage_id)
        .eq('submitted_by', claim.submitted_by)
        .single();
      if (!coverage || coverageError) {
        throw new Error('Failed to fetch coverage for utilization update');
      }
      // Fetch the policy to get the coverage amount
      const { data: policy, error: policyError } = await req.supabase
        .from('policies')
        .select('coverage')
        .eq('id', coverage.policy_id)
        .single();
      if (!policy || policyError || typeof policy.coverage !== 'number') {
        throw new Error('Failed to fetch policy for utilization update');
      }
      // Sum all approved claim amounts for this coverage
      const { data: approvedClaims, error: approvedClaimsError } =
        await req.supabase
          .from('claims')
          .select('amount')
          .eq('coverage_id', coverage.id)
          .eq('user_id', claim.submitted_by)
          .eq('status', 'approved');
      if (!approvedClaims || approvedClaimsError) {
        throw new Error(
          'Failed to fetch approved claims for utilization update',
        );
      }
      const totalApprovedAmount = approvedClaims.reduce(
        (sum, c) => sum + (c.amount || 0),
        0,
      );
      const newUtilizationRate =
        policy.coverage > 0 ? (totalApprovedAmount / policy.coverage) * 100 : 0;

      // Update the coverage utilization_rate
      const { error: updateCoverageError } = await req.supabase
        .from('coverage')
        .update({ utilization_rate: newUtilizationRate })
        .eq('id', coverage.id);
      if (updateCoverageError) {
        throw new Error('Failed to update coverage utilization rate');
      }
    }

    // Return the response
    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim status updated successfully',
      data,
    });
  }

  async remove(
    id: number,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    // Step 1: Fetch claim documents
    const { data: documents, error: fetchDocError } = await req.supabase
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
      await this.fileService.removeFileFromStorage(req.supabase, doc.path);
    }

    // Step 3: Remove claim_documents from database
    const { error: docDeleteError } = await req.supabase
      .from('claim_documents')
      .delete()
      .eq('claim_id', id);

    if (docDeleteError) {
      throw new InternalServerErrorException(
        'Failed to remove claim documents: ' + docDeleteError.message,
      );
    }

    // Step 4: Remove the claim itself
    const { data: deletedClaim, error: claimDeleteError } = await req.supabase
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim removed successfully',
      data: deletedClaim,
    });
  }

  async removeClaimDocument(
    req: AuthenticatedRequest,
    id: number,
  ): Promise<CommonResponseDto> {
    // Step 1: Fetch the document to get its path
    const { data: document, error: fetchError } = await req.supabase
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
    await this.fileService.removeFileFromStorage(req.supabase, document.path);

    // Step 3: Remove the claim document record from the database
    const { data, error: deleteError } = await req.supabase
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

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim document removed successfully',
      data,
    });
  }

  async getStats(
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<ClaimStatsDto>> {
    const supabase = req.supabase;
    const counts: Record<string, number> = {};
    const statuses = Object.values(ClaimStatus);
    for (const status of statuses) {
      const { count, error } = await supabase
        .from('claims')
        .select('id', { head: true, count: 'exact' })
        .eq('status', status);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to count ${status} claims`,
        );
      }
      counts[status] = count || 0;
    }

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim statistics retrieved successfully',
      data: new ClaimStatsDto({
        pending: counts['pending'],
        claimed: counts['claimed'],
        approved: counts['approved'],
        rejected: counts['rejected'],
      }),
    });
  }

  async attachClaimTypesToPolicy(
    claimTypeNames: string[],
    policyId: number,
    req: AuthenticatedRequest,
  ) {
    for (const rawName of claimTypeNames) {
      const name = rawName.toLowerCase();
      // Check if claim type already exists
      const { data: existingType, error: lookupError } = await req.supabase
        .from('claim_types')
        .select('id')
        .eq('name', name)
        .single();

      if (lookupError && lookupError.code !== 'PGRST116') {
        throw new InternalServerErrorException(
          `Error checking claim type: ${name}`,
        );
      }

      let claimTypeId = existingType?.id || null;

      if (!claimTypeId) {
        // Insert new claim type
        const { data: newType, error: insertError } = await req.supabase
          .from('claim_types')
          .insert({ name })
          .select()
          .single();

        if (insertError || !newType) {
          throw new InternalServerErrorException(
            `Failed to create claim type: ${name}`,
          );
        }

        claimTypeId = newType.id;
      }

      // Link claim type to policy via upsert
      const { error: linkError } = await req.supabase
        .from('policy_claim_type')
        .upsert([{ policy_id: policyId, claim_type_id: claimTypeId }], {
          onConflict: 'policy_id,claim_type_id',
        });

      if (linkError) {
        throw new InternalServerErrorException(
          `Failed to link claim type '${name}' to policy`,
        );
      }
    }
  }
}
