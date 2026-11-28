
import {
  form,
  FormField,
  required,
  minLength,
} from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationState } from '../../services/notification-state.service';
import { FormsModule } from '@angular/forms';
import { Component, inject, signal, effect } from '@angular/core';
interface NotificationFormModel {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
@Component({
  selector: 'app-notification-create-page',
  imports: [FormField, FormsModule],
  templateUrl: './notification-create-page.html',
  styleUrl: './notification-create-page.scss',
})

export class NotificationCreatePage {
  private readonly notificationState = inject(NotificationState);
  private readonly route = inject(ActivatedRoute);
  readonly userId = this.route.snapshot.paramMap.get('userId');
  readonly loading = this.notificationState.loading;
  readonly error = this.notificationState.error;
  readonly successMessage = this.notificationState.successMessage;
  private readonly router = inject(Router);

  readonly notificationModel = signal<NotificationFormModel>({
    title: '',
    message: '',
    type: 'info',
  });
constructor() {
  effect(() => {
    if (this.successMessage()) {
      this.notificationModel.set({
        title: '',
        message: '',
        type: 'info',
      });
       this.notificationForm().reset();
    }
  });
}
  readonly notificationForm = form(
    this.notificationModel,
    (path) => {
      required(path.title, {
        message: 'Title is required',
      });

      minLength(path.title, 3, {
        message: 'Title must contain at least 3 characters',
      });

      required(path.message, {
        message: 'Message is required',
      });

      minLength(path.message, 10, {
        message: 'Message must contain at least 10 characters',
      });
    }
  );
  onSubmit(): void {
  if (this.notificationForm().invalid()) {
    return;
  }

  if (!this.userId) {
    this.error.set('Recipient user ID is missing');
    return;
  }

  const formValue = this.notificationModel();

  this.notificationState.createNotification({
    recipient: this.userId,
    title: formValue.title,
    message: formValue.message,
    type: formValue.type,
  });
}
goBack(): void {
  this.router.navigate(['/admin/users', this.userId]);
}
}
