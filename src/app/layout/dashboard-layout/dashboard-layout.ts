
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth.selectors';
import { logout } from '../../store/auth.actions';
import { ClickOutside } from '../../shared/click-outside';
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ClickOutside],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
  private store = inject(Store);
  private router = inject(Router);
  user = this.store.selectSignal(selectUser);

  userName = computed(() => this.user()?.name ?? 'User');

  userRole = computed(() => this.user()?.role ?? 'User');

  userInitial = computed(() => {
    const name = this.userName().trim();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });
  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
  profileMenuOpen = signal(false);

  toggleProfileMenu(): void {
    this.profileMenuOpen.update(open => !open);
  }
  closeProfileMenu(): void {
  this.profileMenuOpen.set(false);
}
}
