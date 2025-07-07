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
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/requests/create-policy.dto';
import { UpdatePolicyDto } from './dto/requests/update-policy.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express'; // adjust path if needed
import { AuthGuard } from '../auth/auth.guard';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createPolicyDto: CreatePolicyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.policyService.create(createPolicyDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.policyService.findAll(req);
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
