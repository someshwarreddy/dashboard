
import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { NotificationState } from '../../services/notification-state.service';

@Component({
  selector: 'app-notification-sidebar',
  imports: [DatePipe],
  templateUrl: './notification-sidebar.html',
  styleUrl: './notification-sidebar.scss',
})
export class NotificationSidebar implements OnInit {

  readonly notificationState = inject(NotificationState);

  ngOnInit(): void {
    this.notificationState.loadNotifications();
    this.notificationState.loadUnreadCount();
  }
}
