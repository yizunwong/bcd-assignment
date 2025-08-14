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
import { ClaimStatus, TransactionStatus, TransactionType } from 'src/enums';
import { ActivityLoggerService } from 'src/logger/activity-logger.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateClaimStatusDto } from './dto/requests/update-claim-status.dto';
@Injectable()
export class ClaimService {
  constructor(
    private readonly fileService: FileService,
    private readonly activityLogger: ActivityLoggerService,
    private readonly notificationsService: NotificationsService,
  ) {}
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
      .upsert(
        {
          id: createClaimDto.id,
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
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (error || !data) {
      throw new InternalServerErrorException(
        'Failed to create claim: ' + (error?.message || 'Unknown error'),
      );
    }

    const claimId = data.id;
    await this.activityLogger.log(`Claim Created: ${claimId}`, user_id, req.ip);

    // Create notification for claim submission (user)
    try {
      // Fetch policy information for better notification message
      const { data: claimWithPolicy } = await req.supabase
        .from('claims')
        .select(
          `
          *,
          coverage:coverage_id(
            policy:policy_id(
              name
            )
          )
        `,
        )
        .eq('id', claimId)
        .single();

      const policyName =
        claimWithPolicy?.coverage?.policy?.name || 'Unknown Policy';

      await this.notificationsService.createSystemNotification(
        user_id,
        'Claim Submitted Successfully',
        `Your claim #${claimId} for policy "${policyName}" has been submitted successfully and is now under review. We will notify you once it's processed.`,
        'info',
      );
    } catch (notificationError) {
      console.error('Failed to create claim notification:', notificationError);
      // Don't throw error here as claim was created successfully
    }

    // Create notification for admin about pending claim
    try {
      // Fetch policy information to get admin details
      const { data: claimWithPolicy } = await req.supabase
        .from('claims')
        .select(
          `
          *,
          coverage:coverage_id(
            policy:policy_id(
              admin_details:admin_details!policies_created_by_fkey1(
                user_id
              )
            )
          )
        `,
        )
        .eq('id', claimId)
        .single();

      const adminUserId =
        claimWithPolicy?.coverage?.policy?.admin_details?.user_id;

      if (adminUserId && adminUserId !== user_id) {
        await this.notificationsService.createSystemNotification(
          adminUserId,
          'New Claim Pending Approval',
          `A new claim #${claimId} has been submitted and is pending your approval. Please review and take action.`,
          'info',
        );
      }
    } catch (adminNotificationError) {
      console.error(
        'Failed to create admin notification:',
        adminNotificationError,
      );
      // Don't throw error here as claim was created successfully
    }

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
    const fileNames = files.map((f) => f.originalname).join(', ');
    await this.activityLogger.log(
      `Uploaded Claim Documents: ${fileNames}`,
      userData.user.id,
      req.ip,
    );

    return new CommonResponseDto({
      statusCode: 201,
      message: 'Claim Documents uploaded successfully',
    });
  }

  async findAll(
    req: AuthenticatedRequest,
    query: FindClaimsQueryDto,
  ): Promise<CommonResponseDto<ClaimResponseDto[]>> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

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
          policy:policy_id(
            id,
            name,
            coverage,
            premium,
            admin_details:admin_details!policies_created_by_fkey1(
              company:companies(name)
            )
          )
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

    if (query.userId) {
      dbQuery = dbQuery.eq('submitted_by', query.userId);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `type.ilike.%${query.search}%,description.ilike.%${query.search}%`,
      );
    }

    const { data, error, count } = await dbQuery;

    if (error) {
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
        policy: {
          id: claim.coverage?.policy?.id,
          name: claim.coverage?.policy?.name,
          coverage: claim.coverage?.policy?.coverage,
          premium: claim.coverage?.policy?.premium,
          provider: claim.coverage?.policy?.admin_details?.company?.name,
        },
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
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data, error } = await req.supabase
      .from('claims')
      .select(
        `*, claim_documents(*), user_details(*), policyholder_details(*), coverage:coverage_id(
          policy:policy_id(
            id,
            name,
            coverage,
            premium,
            admin_details:admin_details!policies_created_by_fkey1(
              company:companies(name)
            )
          )
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
      policy: {
        id: data.coverage?.policy?.id || 0,
        name: data.coverage?.policy?.name || '',
        provider: data.coverage?.policy?.admin_details?.company?.name || '',
        coverage: data.coverage?.policy?.coverage || 0,
        premium: data.coverage?.policy?.premium || 0,
      },
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

    await this.activityLogger.log(`Claim Updated: ${id}`, user_id, req.ip);

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
    body?: UpdateClaimStatusDto,
  ): Promise<CommonResponseDto> {
    // 1️⃣ Authenticate the user
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 2️⃣ Update claim status
    const { data: updatedClaim, error: updateError } = await req.supabase
      .from('claims')
      .update({ status })
      .eq('id', id)
      .select(
        `
        *,
        coverage:coverage_id(
          id,
          user_id,
          policy:policy_id(
            id,
            name,
            coverage,
            admin_details:admin_details!policies_created_by_fkey1(
              user_id
            )
          )
        )
      `,
      )
      .single();

    if (updateError || !updatedClaim) {
      throw new Error(
        'Failed to update claim status: ' +
          (updateError?.message || 'Unknown error'),
      );
    }

    const { coverage } = updatedClaim;
    const policy = coverage?.policy;
    const policyName = policy?.name || 'Unknown Policy';

    // 3️⃣ If approved, update utilization rate
    if (status === ClaimStatus.APPROVED) {
      if (!body?.txHash || body.txHash.trim() === '') {
        throw new BadRequestException('txHash is required for approved claims');
      }
      if (!coverage?.id || !coverage?.user_id) {
        throw new Error('Claim is missing valid coverage details');
      }

      // Sum all approved claims for this coverage
      const { data: approvedClaims, error: approvedClaimsError } =
        await req.supabase
          .from('claims')
          .select('amount')
          .eq('coverage_id', coverage.id)
          .eq('submitted_by', updatedClaim.submitted_by)
          .eq('status', ClaimStatus.APPROVED);

      if (approvedClaimsError || !approvedClaims) {
        throw new Error(
          'Failed to fetch approved claims for utilization update',
        );
      }

      const totalApprovedAmount = approvedClaims.reduce(
        (sum, c) => sum + (c.amount || 0),
        0,
      );
      const newUtilizationRate =
        policy?.coverage > 0
          ? (totalApprovedAmount / policy.coverage) * 100
          : 0;

      // Update coverage utilization_rate
      const { error: utilizationError } = await req.supabase
        .from('coverage')
        .update({ utilization_rate: newUtilizationRate })
        .eq('id', coverage.id);

      if (utilizationError) {
        throw new Error('Failed to update coverage utilization rate');
      }

      // 4️⃣ Record approved claim transaction
      try {
        await req.supabase.from('transactions').insert({
          user_id: updatedClaim.submitted_by,
          coverage_id: coverage.id,
          description: `Claim Payout #${id}`,
          tx_hash: body?.txHash,
          amount: updatedClaim.amount,
          currency: 'ETH',
          created_at: new Date().toISOString(),
          status: TransactionStatus.CONFIRMED,
          type: TransactionType.RECEIVED,
        });
      } catch (txError) {
        console.error('Failed to record claim payout transaction', txError);
      }
    }

    // 5️⃣ Send notifications
    const notificationType =
      status === ClaimStatus.APPROVED
        ? 'success'
        : status === ClaimStatus.REJECTED
          ? 'error'
          : 'info';

    const statusMessage =
      status === ClaimStatus.APPROVED
        ? 'approved'
        : status === ClaimStatus.REJECTED
          ? 'rejected'
          : status.toLowerCase();

    const userNotificationMessage =
      status === ClaimStatus.APPROVED
        ? `Your claim #${id} for policy "${policyName}" has been approved. Payment will be processed shortly.`
        : status === ClaimStatus.REJECTED
          ? `Your claim #${id} for policy "${policyName}" has been rejected. Please contact support for more details.`
          : `Your claim #${id} for policy "${policyName}" has been ${statusMessage}.`;

    // Send to user
    await this.notificationsService.createSystemNotification(
      updatedClaim.submitted_by,
      `Claim ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
      userNotificationMessage,
      notificationType,
    );

    // Send to admin if different from user
    const adminUserId = policy?.admin_details?.user_id;
    if (adminUserId && adminUserId !== updatedClaim.submitted_by) {
      const adminNotificationMessage =
        status === ClaimStatus.APPROVED
          ? `You have approved claim #${id} for policy "${policyName}". The user has been notified.`
          : status === ClaimStatus.REJECTED
            ? `You have rejected claim #${id} for policy "${policyName}". The user has been notified.`
            : `You have updated claim #${id} for policy "${policyName}" to ${statusMessage}. The user has been notified.`;

      await this.notificationsService.createSystemNotification(
        adminUserId,
        `Claim ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
        adminNotificationMessage,
        notificationType,
      );
    }

    // 6️⃣ Log activity
    await this.activityLogger.log(
      `Claim ${statusMessage.charAt(0).toUpperCase() + statusMessage.slice(1)}`,
      userData.user.id,
      req.ip,
    );

    return new CommonResponseDto({
      statusCode: 200,
      message: 'Claim status updated successfully',
      data: updatedClaim,
    });
  }

  async remove(
    id: number,
    req: AuthenticatedRequest,
  ): Promise<CommonResponseDto> {
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

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

    await this.activityLogger.log(
      `Claim Deleted: ${id}`,
      userData.user.id,
      req.ip,
    );

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
    const { data: userData, error: userError } =
      await req.supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

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

    await this.activityLogger.log(
      `Claim Document Deleted: ${data.name}`,
      userData.user.id,
      req.ip,
    );

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
