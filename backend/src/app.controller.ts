// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get Hello World' })
  getHello(): string {
    return 'Hello World!';
  }
}
