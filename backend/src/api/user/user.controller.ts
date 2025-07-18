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
import { CreateUserDto } from './dto/requests/create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/role.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('supabase-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UseGuards(AuthGuard, RolesGuard)
  // @Role('tester')
  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<any> {
    return this.userService.getAllUsers(req);
  }

  @Get(':id')
  // @UseGuards(AuthGuard)
  async findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.userService.getUserById(req, id);
  }

  @Post()
  // @UseGuards(AuthGuard)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateUserDto,
  ): Promise<any> {
    return this.userService.createUser(req, body);
  }
}
