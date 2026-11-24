
import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  signal,

} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Userstate } from '../../services/userstate';
import { User } from '../../services/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users-page',
  imports: [RouterLink],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage implements OnInit {
  private readonly userService = inject(User);
  successMessage = signal('');
  resendError = signal('');
  activationSentIds = signal<Set<string>>(new Set());
  readonly userState = inject(Userstate);
  private readonly router = inject(Router);
  imageFailed = signal<Set<string>>(new Set());
  resendingId = signal<string | null>(null);

  ngOnInit(): void {
    this.userState.loadUsers();
  }

  viewUser(id: string): void {
    this.router.navigate(['/admin/users', id]);
  }
  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
  onImageError(userId: string): void {
    this.imageFailed.update(failed => {
      const updated = new Set(failed);
      updated.add(userId);
      return updated;
    });
  }
  resendActivation(userId: string): void {
    if (this.resendingId()) {
      return;
    }

    this.resendingId.set(userId);
    this.successMessage.set('');
    this.resendError.set('');

    this.userService.resendActivation(userId).subscribe({
      next: (response) => {
        if (response.emailSent) {
          this.activationSentIds.update(ids => {
            const updated = new Set(ids);
            updated.add(userId);
            return updated;
          });

          this.successMessage.set(response.message);
          this.resendError.set('');
        } else {
          this.resendError.set(response.message);
          this.successMessage.set('');
        }

        this.resendingId.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.resendError.set(
          error.error?.message ?? 'Unable to resend activation email.'
        );
        this.resendingId.set(null);
      }
    });
  }
}
