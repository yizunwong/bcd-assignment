import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetcher } from '@/api/fetch';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  created_at: string;
  read: boolean;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationsResponse> => {
      return customFetcher({
        url: '/notifications',
        method: 'GET',
      });
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return customFetcher({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return customFetcher({
        url: '/notifications/read-all',
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
