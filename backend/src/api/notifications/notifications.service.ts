import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthenticatedRequest } from 'src/supabase/types/express';

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  read: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  message: string;
  notification_type?: 'info' | 'success' | 'warning' | 'error' | 'alert';
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getNotifications(
    req: AuthenticatedRequest,
    page: number = 1,
    limit: number = 20,
  ): Promise<NotificationsResponse> {
    const offset = (page - 1) * limit;

    const { data: notifications, error: notificationsError } =
      await req.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (notificationsError) {
      throw new Error(
        `Failed to fetch notifications: ${notificationsError.message}`,
      );
    }

    const { count, error: countError } = await req.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    if (countError) {
      throw new Error(`Failed to count notifications: ${countError.message}`);
    }

    return {
      data: (notifications || []).map((notification) => ({
        id: notification.id,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        notification_type: notification.notification_type,
        read: notification.read ?? false,
        created_at: notification.created_at ?? new Date().toISOString(),
        updated_at: notification.updated_at,
      })) as Notification[],
      total: count || 0,
      page,
      limit,
    };
  }

  async markAsRead(
    req: AuthenticatedRequest,
    notificationId: number,
  ): Promise<{ success: boolean }> {
    // First check if the notification belongs to the user
    const { data: notification, error: fetchError } = await req.supabase
      .from('notifications')
      .select('id, user_id')
      .eq('id', notificationId)
      .single();

    if (fetchError || !notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== req.user.id) {
      throw new ForbiddenException(
        'You can only mark your own notifications as read',
      );
    }

    const { error: updateError } = await req.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', req.user.id);

    if (updateError) {
      throw new Error(
        `Failed to mark notification as read: ${updateError.message}`,
      );
    }

    return { success: true };
  }

  async markAllAsRead(
    req: AuthenticatedRequest,
  ): Promise<{ success: boolean }> {
    const { error } = await req.supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq('user_id', req.user.id)
      .eq('read', false);

    if (error) {
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`,
      );
    }

    return { success: true };
  }

  async createNotification(
    req: AuthenticatedRequest,
    notificationData: CreateNotificationDto,
  ): Promise<Notification> {
    const { data: notification, error } = await req.supabase
      .from('notifications')
      .insert({
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        notification_type: notificationData.notification_type || 'info',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return {
      id: notification.id,
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      notification_type: notification.notification_type,
      read: notification.read ?? false,
      created_at: notification.created_at ?? new Date().toISOString(),
      updated_at: notification.updated_at,
    };
  }

  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
    notificationType:
      | 'info'
      | 'success'
      | 'warning'
      | 'error'
      | 'alert' = 'info',
  ): Promise<Notification> {
    // Use the supabase service directly for system notifications
    const supabaseClient = this.supabaseService.createClientWithToken();

    console.log('Creating system notification with DEBUG:', {
      userId,
      title,
      message,
      notificationType,
    });

    const { data: notification, error } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        notification_type: notificationType,
      })
      .select()
      .single();

    if (error) {
      console.error('System notification creation failed:', error);
      throw new Error(`Failed to create system notification: ${error.message}`);
    }

    console.log('System notification created successfully:', notification);

    return {
      id: notification.id,
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      notification_type: notification.notification_type,
      read: notification.read ?? false,
      created_at: notification.created_at ?? new Date().toISOString(),
      updated_at: notification.updated_at,
    };
  }
}
