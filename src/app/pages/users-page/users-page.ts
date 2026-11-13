import { Component, computed, effect, Signal, signal, WritableSignal } from '@angular/core';
// import { ManagedUser } from '../../models/managed-user';

@Component({
  selector: 'app-users-page',
  imports: [],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {

  // users = signal<ManagedUser[]>([]);

  loading = signal(false);

  error = signal<string | null>(null);

  search = signal('');

  page = signal(1);

  price = signal(200);

  quantity = signal(3);

  discount = signal(10);

  limit = signal(10);

  selectedCount = signal(0);

  total = signal(0);

  count: WritableSignal<number> = signal(10);

  readonlyCount: Signal<number> = this.count;
  //  firstName = signal('Angular');
  //   lastName = signal('Developer');

  //   fullName = computed(() =>
  //     `${this.firstName()} ${this.lastName()}`
  //   );

  totalPages = computed(() =>
    Math.ceil(this.total() / this.limit())
  );

  users = signal([
  { id: 1, name: 'Ravi', role: 'Admin' },
  { id: 2, name: 'Kiran', role: 'User' },
  { id: 3, name: 'Arun', role: 'User' }
]);

  constructor() {
    this.count.set(20);
    this.count.update(v => v + 1);
    // this.firstName.set('React');
    console.log(this.readonlyCount());
    // this.readonlyCount.set(30);
    // console.log(this.fullName());

    // Angular Developer
     effect(() => {
    console.log('Effect executed:', this.count());
  });
  }

  changePage(): void {
    // Set page to 2
    this.page.set(2);
  }

  changeSearch(): void {
    // Set search to 'Angular'
    this.search.set('Angular');
  }

  startLoading(): void {
    // Set loading to true
    this.loading.set(true);
  }
  changeCount(): void {
    // Set count to 15
    this.count.set(15);
  }
  selectUser(): void {
    this.selectedCount.update(count => count + 1);
  }

  removeUser(): void {
    this.selectedCount.update(count => count - 1);
  }

  incrementPage(): void {
    // Increase page by 1 using update()
    this.page.update(v => v + 1);
  }

  incrementTotal(): void {
    // Increase total users by 5 using update()
    this.total.update(v => v + 5);
  }

  clearSearch(): void {
    // Use set() to clear the search keyword
    this.search.set('');
  }
  finalPrice = computed(() => {
  // Calculate price * quantity - discount
  return this.price() * this.quantity() - this.discount();
});
 increment() {
    this.count.update(value => value + 1);
  }

  decrement() {
    this.count.update(value => value - 1);
  }
  
addUser() {
  const newUser = {
    id: 4,
    name: 'Suresh',
    role: 'User'
  };

  this.users.update(currentUsers => [
    ...currentUsers,
    newUser
  ]);
  
}
 loadUsers() {
    this.loading.set(true);

    // Simulate API response
    this.users.set([
      { id: 3, name: 'Arun', role: 'Admin' },
      { id: 4, name: 'Suresh', role: 'User' }
    ]);

    this.loading.set(false);
  }
}
