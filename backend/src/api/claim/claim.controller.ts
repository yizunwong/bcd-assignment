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
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('claim')
@ApiBearerAuth('supabase-auth')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createClaimDto: CreateClaimDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.claimService.createClaim(createClaimDto, req);
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
