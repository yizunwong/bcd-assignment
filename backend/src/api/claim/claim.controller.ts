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
  Query,
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { UpdateClaimDto } from './dto/requests/update-claim.dto';
import { CreateClaimDto } from './dto/requests/create-claim.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('claim')
@ApiBearerAuth('supabase-auth')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents'))
  @UseGuards(AuthGuard)
  create(
    @Body() createClaimDto: CreateClaimDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.claimService.createClaim(createClaimDto, req, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.claimService.findAll(
      req,
      page,
      limit,
      category,
      search,
      sortBy,
      sortOrder,
    );
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
