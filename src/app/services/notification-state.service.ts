import { Service, inject, signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification';
import { Subject, switchMap, timer } from 'rxjs';

@Service()
export class NotificationState {
  private readonly successMessageReset$ = new Subject<void>();
  private readonly notificationService = inject(NotificationService);
  readonly successMessage = signal<string | null>(null);
  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly closeRequested = signal(false);
  constructor() {
    this.successMessageReset$
      .pipe(
        switchMap(() => timer(3000))
      )
      .subscribe(() => {
        this.successMessage.set(null);
      });
  }
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
      next: (result) => {
        const updatedNotification = result.notification;
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
      next: (result) => {
        this.notifications.update((notifications) =>
          notifications.filter(
            (notification) => notification._id !== id
          )
        );

        this.successMessage.set(result.message);
        this.successMessageReset$.next();
        this.loadUnreadCount();
      },
      error: () => {
        this.error.set('Failed to delete notification');
      }
    });
  }

  // Create notification for a user (Admin)
  createNotification(data: {
    recipient: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }): void {
    this.loading.set(true);
    this.error.set(null);

    this.notificationService.createNotification(data).subscribe({
      next: (result) => {
        this.loading.set(false);

        this.successMessage.set(result.message);
        this.successMessageReset$.next();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to create notification');
      }
    });
  }
  requestClose(): void {
    this.closeRequested.set(true);
  }

  resetCloseRequest(): void {
    this.closeRequested.set(false);
  }
}
