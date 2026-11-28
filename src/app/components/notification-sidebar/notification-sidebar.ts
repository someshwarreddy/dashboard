
import { Component, effect, inject, OnInit, signal, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClickOutside } from '../../shared/click-outside';
import { NotificationState } from '../../services/notification-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-sidebar',
  imports: [DatePipe, ClickOutside],
  templateUrl: './notification-sidebar.html',
  styleUrl: './notification-sidebar.scss',
})
export class NotificationSidebar implements OnInit {
 readonly isClosing = signal(false);
  readonly notificationState = inject(NotificationState);
  private readonly router = inject(Router);
  constructor() {
  effect(() => {
    if (this.notificationState.closeRequested()) {
      this.closeNotifications();
    }
  });
}
  ngOnInit(): void {
    this.notificationState.loadNotifications();
    this.notificationState.loadUnreadCount();
  }

closeNotifications(): void {
  if (this.isClosing()) return;

  this.isClosing.set(true);
}
// onAnimationEnd(event: AnimationEvent): void {
  
//   if (
//     event.animationName !== 'slideOut' ||
//     event.target !== event.currentTarget
//   ) {
//     return;
//   }

//   this.notificationState.resetCloseRequest();

//   this.router.navigate([
//     {
//       outlets: {
//         sidebar: null
//       }
//     }
//   ]);
// }
onAnimationEnd(event: AnimationEvent): void {
  if (
    event.target !== event.currentTarget ||
    !this.isClosing()
  ) {
    return;
  }

  this.notificationState.resetCloseRequest();

  this.router.navigate([
    {
      outlets: {
        sidebar: null
      }
    }
  ]);
}
}
