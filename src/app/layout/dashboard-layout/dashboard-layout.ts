
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth.selectors';
import { logout } from '../../store/auth.actions';
import { ClickOutside } from '../../shared/click-outside';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { User } from '../../services/user';
import { updateUserImage } from '../../store/auth.actions';
import { NotificationState } from '../../services/notification-state.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ClickOutside],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
  readonly notificationState = inject(NotificationState);
  uploading = signal(false);
  uploadError = signal('');
  private userService = inject(User);
  private store = inject(Store);
  private router = inject(Router);
  user = this.store.selectSignal(selectUser);
  imageFailed = signal(false);


  userName = computed(() => this.user()?.name ?? 'User');

  userRole = computed(() => this.user()?.role ?? 'User');
  profileMenuOpen = signal(false);

  userInitial = computed(() => {
    const name = this.userName().trim();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });
  profileImageUrl = computed(() => {
    const image = this.user()?.image;

    return image
      ? `http://localhost:5000${image}`
      : null;
  });
  constructor() {
  this.notificationState.loadUnreadCount();

  // Keep your existing router event subscription here.

    this.router.events
      .pipe(
        filter(event =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        console.log('ROUTER EVENT:', event);
      });

  }
  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update(open => !open);
  }
  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }
  onImageError(): void {
    this.imageFailed.set(true);
  }
  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.set('Only JPEG, PNG and WebP images are allowed');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.uploadError.set('Image size must not exceed 2 MB');
      input.value = '';
      return;
    }

    this.uploadError.set('');
    this.uploading.set(true);

    this.userService.uploadProfileImage(file).subscribe({
      next: response => {
        const image = response.user.image;

        if (image) {
          this.store.dispatch(updateUserImage({ image }));
          this.imageFailed.set(false);
        }

        this.uploading.set(false);
        input.value = '';
      },
      error: err => {
        this.uploadError.set(
          err.error?.message ?? 'Profile image upload failed'
        );

        this.uploading.set(false);
        input.value = '';
      }
    });
  }
  
toggleNotifications(): void {
  const urlTree = this.router.parseUrl(this.router.url);

  const isOpen = !!urlTree.root.children['sidebar'];

  if (isOpen) {
    this.notificationState.requestClose();
    return;
  }

  this.router.navigate([
    {
      outlets: {
        sidebar: ['notifications']
      }
    }
  ]);
}

}
