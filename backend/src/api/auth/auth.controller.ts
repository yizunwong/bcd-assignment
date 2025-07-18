import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/requests/register.dto';
import { LoginDto } from './dto/requests/login.dto';
import { LoginResponseDto } from './dto/responses/login.dto';
import { AuthGuard } from './auth.guard';
import { CommonResponseDto } from '../../common/common.dto';
import { AuthenticatedRequest } from 'src/supabase/types/express';
import { UserResponseDto } from './dto/responses/user.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiExtraModels(CommonResponseDto, LoginResponseDto, UserResponseDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseDto) },
          },
        },
      ],
    },
  })
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
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CommonResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserResponseDto) },
          },
        },
      ],
    },
  })
  @ApiBearerAuth('supabase-auth')
  async getMe(
    @Request() req: AuthenticatedRequest,
  ): Promise<CommonResponseDto<UserResponseDto>> {
    return this.authService.getMe(req);
  }
}
