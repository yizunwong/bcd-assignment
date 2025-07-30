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
import { Request } from 'express';
import { AuthUserResponseDto } from './dto/responses/auth-user.dto';
import { Response } from 'express';

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

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(req, res);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiCommonResponse(AuthUserResponseDto, false, 'User login')
  async getMe(
    @Request() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<AuthUserResponseDto>> {
    return this.authService.getMe(req);
  }
}
