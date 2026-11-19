
import { Service, signal, computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

import { User as UserService } from './user';
import { ManagedUser } from '../models/managed-user';

@Service()
export class Userstate {
  private readonly userService = inject(UserService);
  private readonly searchSubject = new Subject<string>();
  // Private writable state
  private readonly _users = signal<ManagedUser[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _search = signal('');
  private readonly _page = signal(1);
  private readonly _limit = signal(10);
  private readonly _total = signal(0);

  // Public read-only state
  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  search = this._search.asReadonly();
  page = this._page.asReadonly();
  limit = this._limit.asReadonly();

  totalUsers = computed(() => this._total());

  totalPages = computed(() =>
    Math.ceil(this._total() / this._limit())
  );
  paginationPages = computed(() => {
    const total = this.totalPages();
    const current = this._page();

    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    const pages: (number | '...')[] = [1];

    if (start > 2) {
      pages.push('...');
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });
 constructor() {
  this.searchSubject.pipe(
    debounceTime(500),
    distinctUntilChanged()
  ).subscribe(search => {
    this._page.set(1);       // Reset page first
    this._search.set(search);
    this.loadUsers();
  });
}
  // Load users from API
  loadUsers(): void {
    this._loading.set(true);
    this._error.set(null);

    this.userService.getUsers(
      this._page(),
      this._limit(),
      this._search()
    )
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({
        next: response => {
          this._users.set(response.users);
          this._total.set(response.total);
        },
        error: error => {
          this._error.set(
            error.message || 'Failed to load users'
          );
        }
      });
  }

  // Update search
setSearch(value: string): void {
  this.searchSubject.next(value.trim());
}

  // Update page
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this._page.set(page);
    this.loadUsers();
  }

}
