import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../auth/role.decorator';
import { RolesGuard } from '../auth/role.guard';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { UserResponseDto } from './dto/respond/user.dto';
import { UserStatsResponseDto } from './dto/respond/user-stats.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('supabase-auth')
@UseGuards(AuthGuard, RolesGuard)
@Role('system_admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiCommonResponse(UserResponseDto, true, 'Get all users')
  async findAll(): Promise<CommonResponseDto<UserResponseDto[]>> {
    return this.userService.getAllUsers();
  }

  @Get('stats')
  @ApiCommonResponse(UserStatsResponseDto, false, 'Get user statistics')
  async getStats(): Promise<CommonResponseDto<UserStatsResponseDto>> {
    return this.userService.getUserStats();
  }

  @Get(':id')
  @ApiCommonResponse(UserResponseDto, false, 'Get user by id')
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    return this.userService.getUserById(id);
  }

  @Post()
  @ApiCommonResponse(UserResponseDto, false, 'Create user')
  async create(
    @Body() body: CreateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    return this.userService.createUser(body);
  }
}
