import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { LoginResponseDto } from './dto/responses/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiCommonResponse, CommonResponseDto } from '../../common/common.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { UserResponseDto } from './dto/responses/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCommonResponse(LoginResponseDto, false, 'User login')
  async login(
    @Body() body: LoginDto,
  ): Promise<CommonResponseDto<LoginResponseDto>> {
    return this.authService.signInWithEmail(body);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<CommonResponseDto> {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiCommonResponse(UserResponseDto, false, 'User login')
  @ApiBearerAuth('supabase-auth')
  async getMe(
    @Request() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    return this.authService.getMe(req);
  }
}
