import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/requests/create.dto';
import { UpdateUserDto } from './dto/requests/update.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ApiCommonResponse, CommonResponseDto } from 'src/common/common.dto';
import { UserResponseDto } from './dto/responses/user.dto';
import { UserStatsResponseDto } from './dto/responses/user-stats.dto';
import { FindUsersQueryDto } from './dto/responses/user-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadDocDto } from '../file/requests/document-upload.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('supabase-auth')
@UseGuards(AuthGuard, RolesGuard)
// @Role('system_admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiCommonResponse(UserResponseDto, true, 'Get all users')
  async findAll(
    @Query() query: FindUsersQueryDto,
  ): Promise<CommonResponseDto<UserResponseDto[]>> {
    return this.userService.getAllUsers(query);
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

  @Patch(':id')
  @ApiCommonResponse(UserResponseDto, false, 'Update user')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    return this.userService.updateUser(id, body);
  }

  @Post(':id/avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCommonResponse(
    CommonResponseDto<{ url: string }>,
    false,
    'Upload user avatar',
  )
  async uploadAvatar(
    @Param('id') id: string,
    @Body() body: UploadDocDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CommonResponseDto<{ url: string }>> {
    return this.userService.uploadAvatar(id, file);
  }
}
