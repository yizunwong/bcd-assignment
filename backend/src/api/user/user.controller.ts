import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './requests/create.dto';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('supabase-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<any> {
    return this.userService.getAllUsers(req);
  }

  @Get(':id')
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.userService.getUserById(req, id);
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateUserDto,
  ): Promise<any> {
    return this.userService.createUser(req, body);
  }
}
