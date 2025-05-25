// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('app') // Group endpoints under "app"
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get Hello World' })
  getHello(): string {
    return 'Hello World!';
  }
}
