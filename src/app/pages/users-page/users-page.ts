
import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,

} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
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
private readonly router = inject(Router);

  ngOnInit(): void {
    this.userState.loadUsers();
  }

viewUser(id: number): void {
  this.router.navigate(['/admin/users', id]);
}
}
