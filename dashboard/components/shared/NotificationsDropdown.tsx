'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { parsePgTimestamp } from '@/utils/formatHelper';

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState<
    Set<string>
  >(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: notificationsData, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications?.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (notificationType: string) => {
    switch (notificationType?.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
      case "warning":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean
  ) => {
    if (!isRead) {
      await markAsRead.mutateAsync(notificationId);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead.mutateAsync();
    }
  };

  const toggleNotificationExpansion = (notificationId: string) => {
    setExpandedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const isLongMessage = (message: string) => message.length > 150;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative floating-button w-9 h-9 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 lg:w-[32rem] xl:w-[36rem] max-w-[36rem] glass-card rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 py-2 z-50 max-h-[32rem] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/20 dark:border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isPending}
              >
                {markAllAsRead.isPending ? "Marking..." : "Mark all read"}
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[24rem] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications
              </div>
            ) : (
              <div className="space-y-1">
                {notifications?.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-900/20"
                    )}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.read
                      )
                    }
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium flex-1 min-w-0",
                              notification.read
                                ? "text-slate-600 dark:text-slate-400"
                                : "text-slate-900 dark:text-slate-100"
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <div className="mt-1">
                          <p
                            className={cn(
                              "text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-normal break-words",
                              !expandedNotifications.has(notification.id) &&
                                isLongMessage(notification.message) &&
                                "line-clamp-2"
                            )}
                          >
                            {notification.message}
                          </p>
                          {isLongMessage(notification.message) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNotificationExpansion(notification.id);
                              }}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-1 flex items-center gap-1 transition-colors"
                            >
                              {expandedNotifications.has(notification.id) ? (
                                <>
                                  <ChevronUp className="w-3 h-3" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  Show more
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {formatDistanceToNow(
                            parsePgTimestamp(notification.created_at),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{unreadCount} unread</span>
                <span>{notifications.length} total</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
