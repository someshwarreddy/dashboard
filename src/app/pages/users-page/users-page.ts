import { Component, inject, } from '@angular/core';
// import { ManagedUser } from '../../models/managed-user';
import { Userstate } from '../../services/userstate';
;

@Component({
  selector: 'app-users-page',
  imports: [],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {

  userState = inject(Userstate);
  addUser() {
    this.userState.addUser({
      id: 4,
      name: 'Suresh',
      role: 'User'
    });
  }

}
