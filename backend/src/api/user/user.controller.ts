import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/role.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('supabase-auth')
@UseGuards(AuthGuard, RolesGuard)
@Role('system_admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Get('stats')
  async getStats() {
    return this.userService.getUserStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.userService.getUserById(id);
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<any> {
    return this.userService.createUser(body);
  }
}
