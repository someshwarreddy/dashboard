import { Component, inject, ChangeDetectionStrategy, signal, viewChild, afterRenderEffect, ElementRef} from '@angular/core';
import { Userstate } from '../../services/userstate';

import { RouterLink, RouterLinkActive,  } from '@angular/router';

;

@Component({
  selector: 'app-users-page',
   imports: [RouterLink, RouterLinkActive, ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage {
  userState = inject(Userstate);
users = this.userState.users;
  message = signal('Hello Angular');

  box = viewChild<ElementRef<HTMLDivElement>>('box');
   constructor() {
    afterRenderEffect({
      read: () => {
        const element = this.box()?.nativeElement;

        if (element) {
          console.log(element.getBoundingClientRect().width);
        }
      }
    });
  }
  addUser() {
    this.userState.addUser({
      id: 4,
      name: 'Suresh',
      role: 'User'
    });
  }
}
