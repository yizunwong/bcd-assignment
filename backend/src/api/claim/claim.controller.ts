import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('claim')
@ApiBearerAuth('supabase-auth')
@ApiTags('Claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('documents'))
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a claim with optional documents',
    schema: {
      type: 'object',
      properties: {
        policy_id: { type: 'integer' },
        claim_type: { type: 'string' },
        amount: { type: 'number' },
        description: { type: 'string' },
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  create(
    @Body() createClaimDto: CreateClaimDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.claimService.createClaim(createClaimDto, req, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.claimService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.claimService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.claimService.update(+id, updateClaimDto, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.claimService.remove(+id);
  }
}
