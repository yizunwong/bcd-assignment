import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { Response } from 'express';
import { ProfileResponseDto } from './dto/responses/profile.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('supabase-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCommonResponse(LoginResponseDto, false, 'User login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommonResponseDto<LoginResponseDto>> {
    return this.authService.signInWithEmail(body, res);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<CommonResponseDto> {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(req, res);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiCommonResponse(ProfileResponseDto, false, 'User login')
  async getMe(
    @Req() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<ProfileResponseDto>> {
    return this.authService.getMe(req);
  }
}
