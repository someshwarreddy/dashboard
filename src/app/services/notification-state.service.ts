
import { Service, inject, signal } from '@angular/core';

import { NotificationService } from './notification.service';
import { Notification } from '../models/notification';

@Service()
export class NotificationState {

  private readonly notificationService = inject(NotificationService);

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Load all notifications
  loadNotifications(): void {
    this.loading.set(true);
    this.error.set(null);

    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notifications');
        this.loading.set(false);
      }
    });
  }

  // Load unread notification count
  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (result) => {
        this.unreadCount.set(result.count);
      },
      error: () => {
        this.error.set('Failed to load unread count');
      }
    });
  }

  // Mark one notification as read
  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: (updatedNotification) => {
        this.notifications.update((notifications) =>
          notifications.map((notification) =>
            notification._id === id
              ? updatedNotification
              : notification
          )
        );

        this.loadUnreadCount();
      },
      error: () => {
        this.error.set('Failed to mark notification as read');
      }
    });
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((notifications) =>
          notifications.map((notification) => ({
            ...notification,
            isRead: true
          }))
        );

        this.unreadCount.set(0);
      },
      error: () => {
        this.error.set('Failed to mark all notifications as read');
      }
    });
  }

  // Delete one notification
  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.update((notifications) =>
          notifications.filter((notification) => notification._id !== id)
        );

        this.loadUnreadCount();
      },
      error: () => {
        this.error.set('Failed to delete notification');
      }
    });
  }

}
