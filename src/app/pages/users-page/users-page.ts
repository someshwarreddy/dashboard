
import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,

} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Userstate } from '../../services/userstate';

;

@Component({
  selector: 'app-users-page',
   imports: [RouterLink],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage implements OnInit {
  readonly userState = inject(Userstate);

  ngOnInit(): void {
    this.userState.loadUsers();
  }
 
}
