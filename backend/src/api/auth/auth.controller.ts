import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { LoginResponseDto } from './dto/responses/login.dto';
import { CommonResponseDto } from '../../common/common.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(
    @Body() body: LoginDto,
  ): Promise<CommonResponseDto<LoginResponseDto>> {
    return this.authService.signInWithEmail(body);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<CommonResponseDto> {
    return this.authService.register(dto);
  }
}
