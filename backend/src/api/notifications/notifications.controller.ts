import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/supabase/types/express';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.getNotifications(req, page, limit);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationsService.markAsRead(req, parseInt(notificationId));
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req);
  }
}
