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
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express'; // adjust path if needed
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('policy')
@ApiBearerAuth('supabase-auth')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createPolicyDto: CreatePolicyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.policyService.create(createPolicyDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest, // ✅ required goes first
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
