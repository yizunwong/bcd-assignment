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
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('policy')
@ApiBearerAuth('supabase-auth')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files')) // "files" = field name in DTO
  @UseGuards(AuthGuard)
  async create(
    @Body() createPolicyDto: CreatePolicyDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.policyService.create(createPolicyDto, req, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.policyService.findAll(
      req,
      +page,
      +limit,
      category,
      search,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.policyService.findOne(+id, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.policyService.update(+id, updatePolicyDto, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.policyService.remove(+id, req);
  }
}
