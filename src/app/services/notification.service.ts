
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Notification } from '../models/notification';

@Service()
export class NotificationService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5000/api/notifications';

  // API 1: Get logged-in user's notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  // API 2: Get unread notification count
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/unread-count`
    );
  }

  // API 3: Mark one notification as read using notification id 
 markAsRead(id: string): Observable<{
  message: string;
  notification: Notification;
}> {
  return this.http.patch<{
    message: string;
    notification: Notification;
  }>(
    `${this.apiUrl}/${id}/read`,
    {}
  );
}

  // API 4: Mark all notifications as read
  markAllAsRead(): Observable<{
    message: string;
    modifiedCount: number;
  }> {
    return this.http.patch<{
      message: string;
      modifiedCount: number;
    }>(`${this.apiUrl}/read-all`, {});
  }

  // API 5: Delete one notification
  deleteNotification(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }

  // API 6: Admin creates a notification for a user
  createNotification(data: {
    recipient: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }): Observable<{ message: string; notification: Notification }> {
    return this.http.post<{
      message: string;
      notification: Notification;
    }>(this.apiUrl, data);
  }

}
