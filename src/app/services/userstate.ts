import { Service, signal, computed } from '@angular/core';

@Service()
export class Userstate {
     users = signal([
    { id: 1, name: 'Ravi', role: 'Admin' },
    { id: 2, name: 'Kiran', role: 'User' },
    { id: 3, name: 'Arun', role: 'User' }
  ]);

  totalUsers = computed(() => this.users().length);

  addUser(newUser: { id: number; name: string; role: string }) {
    this.users.update(currentUsers => [
      ...currentUsers,
      newUser
    ]);
  }

  deleteUser(id: number) {
    this.users.update(currentUsers =>
      currentUsers.filter(user => user.id !== id)
    );
  }
}
